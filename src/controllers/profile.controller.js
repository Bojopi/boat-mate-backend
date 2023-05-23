import { response } from "express";
import { Person } from "../models/Person.js";
import { Profile } from "../models/Profile.js";
import { Provider } from "../models/Provider.js";
import { Customer } from "../models/Customer.js";
import { deleteImage, searchImage, uploadImage } from "../utils/cloudinary.js";
import { sequelize } from "../database/database.js";
import { decryptPassword, encriptPassword } from "../utils/bcryp.js";
import { updateJWT } from "../helpers/generate-jwt.js";
import { serialize } from "cookie";
import { Role } from "../models/Role.js";
import fs from 'fs'
import path from "path";

export const getUsersAll = async (req, res = response) => {

    try {
        const users = await Profile.findAll({
            include: [Person, Role],
            order: [
                [Person, 'person_name', 'ASC']
            ]
        });
        res.status(200).json({users})
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}

export const setRoleUser = async (req, res = response) => {

    const { tokenUser } = req.cookies;

    const { idProfile } = req.params;
    const { role } = req.body;
    try {
        await Profile.update(
            {roleId: role},
            {where: {id_profile: idProfile}}
        );

        let resUser = await Profile.findOne({
            where: { id_profile: idProfile },
            attributes: ['id_profile',
                        'email',
                        'password',
                        'profile_state',
                        'google',
                        'person.id_person',
                        'person.person_name',
                        'person.lastname',
                        'person.phone',
                        'person.person_image',
                        'role.id_role',
                        'role.role_description'
                    ],
            include: [
                {
                    model: Person,
                    attributes: []
                },
                {
                    model: Role,
                    attributes: []
                }],
            raw: true,
        });
        
        //update the jwt
        const token = await updateJWT(resUser, tokenUser);

        const serialized = serialize('tokenUser', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 23,
            path: '/',
            // domain: 'ec2-3-131-141-161.us-east-2.compute.amazonaws.com'
        })

        res.setHeader('Set-Cookie', serialized);

        res.status(200).json({ msg: 'Role updated successfully'});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}

export const activateProfile = async (req, res = response) => {
    const {idProfile} = req.params;

    try {
        const profile = await Profile.update({
            profile_state: true
        }, {
            where: {id_profile: idProfile},
            returning: ['profile_state']
        });

        res.status(200).json({msg: 'Successfully activated', profile});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const setDataProfile = async (req, res = response) => {

    const { tokenUser } = req.cookies;

    const {
        name,
        lastname,
        providerName,
        email,
        password,
        lat,
        lng,
        phone,
        state,
        providerDescription
    } = req.body;

    let providerImage, personImage, providerId, customerId, resUser;
    if(req.files != null) {
        const {providerImage: provImg, personImage: perImg} = req.files;
        providerImage = provImg;
        personImage = perImg;
    }

    const { id } = req.params;

    let updateData = {};

    //search profile
    const {personId, roleId, password: pass, person_image} = await Profile.findOne({
        attributes: ['id_profile', 'personId', 'roleId', 'password', 'person.person_image'],
        where: {id_profile: id},
        include: [{
            model: Person,
            attributes: []
        }],
        raw: true
    });

    if(name != null || name != '') updateData.person_name = name;
    if(lastname != null || lastname != '') updateData.lastname = lastname;
    if(email != null || email != '') updateData.email = email;
    if(password != null || password != '') {

        const compare = await decryptPassword(password, pass);
        if(!compare) {
            const hash = await encriptPassword(password)
            if(hash) {
                updateData.password = hash;
            }
        }
    }
    if(phone != null || phone != '') updateData.phone = phone;
    if(state != null || state != '') updateData.profile_state = state == 'true' || state == 1 ? true : false;
    if(personImage != null && personImage != undefined && person_image != '' && person_image != null) {
        const resDelete = await deleteImage(person_image);
        if(resDelete) {
            const result = await uploadImage(personImage.tempFilePath);
            updateData.person_image = result.secure_url;
            fs.unlinkSync(path.join(personImage.tempFilePath));
        }
    }

    //validate the role
    if(roleId == 4) {
        const {id_customer} = await Customer.findOne({
            attributes: ['id_customer'],
            where: {profileId: id}
        });

        customerId = id_customer;

        if(lat != null || lat != '') updateData.customer_lat = lat;
        if(lng != null || lng != '') updateData.customer_lng = lng;

    } else if(roleId == 3) {
        const {id_provider, provider_image} = await Provider.findOne({
            attributes: ['id_provider', 'provider_image'],
            where: {profileId: id}
        });

        providerId = id_provider;

        if(providerName != null || providerName != '') updateData.provider_name = providerName;
        if(providerDescription != null || providerDescription != '') updateData.provider_description = providerDescription;

        if(lat != null || lat != '') updateData.provider_lat = lat;
        if(lng != null || lng != '') updateData.provider_lng = lng;

        if(providerImage != null && providerImage != undefined && provider_image != null && provider_image != '') {
            const resDelete = await deleteImage(provider_image);
            if(resDelete) {
                const result = await uploadImage(providerImage.tempFilePath);
                updateData.provider_image = result.secure_url;
                fs.unlinkSync(path.join(providerImage.tempFilePath));
            }
        }
    }

    //make the corresponding updates
    try {
        await sequelize.transaction(async (t) => {
            await Person.update(updateData, {
                where: { id_person: personId },
                transaction: t
            })

            await Profile.update(updateData, {
                where: { id_profile: id },
                transaction: t
            })

            resUser = await Profile.findOne({
                where: { id_profile: id },
                attributes: ['id_profile',
                            'email',
                            'password',
                            'profile_state',
                            'google',
                            'person.id_person',
                            'person.person_name',
                            'person.lastname',
                            'person.phone',
                            'person.person_image',
                            'role.id_role',
                            'role.role_description'
                        ],
                include: [
                    {
                        model: Person,
                        attributes: []
                    },
                    {
                        model: Role,
                        attributes: []
                    }],
                raw: true,
                transaction: t
            });

            if(roleId == 4) {
                await Customer.update(updateData, {
                    where: { id_customer: customerId },
                    transaction: t
                });

                resUser = await Customer.findOne({
                    attributes: [
                        'id_customer',
                        'customer_lat',
                        'customer_lng',
                        'profile.id_profile',
                        'profile.profile_state',
                        'profile.email',
                        'profile.google',
                        'profile.person.id_person',
                        'profile.person.person_name',
                        'profile.person.lastname',
                        'profile.person.phone',
                        'profile.person.person_image',
                        'profile.role.id_role',
                        'profile.role.role_description',
                    ],
                    include: [{
                        model: Profile,
                        attributes: [],
                        where: {
                            id_profile: id
                        },
                        include: [{
                            model: Person,
                            attributes: []
                        },
                        {
                            model: Role,
                            attributes: []
                        }]
                    }],
                    raw: true,
                    transaction: t
                });
            } else if(roleId == 3) {
                await Provider.update(updateData, {
                    where: { id_provider: providerId },
                    transaction: t
                });

                resUser = await Provider.findOne({
                    attributes: [
                        'id_provider',
                        'provider_name',
                        'provider_image',
                        'provider_description',
                        'provider_lat',
                        'provider_lng',
                        'profile.id_profile',
                        'profile.profile_state',
                        'profile.email',
                        'profile.google',
                        'profile.person.id_person',
                        'profile.person.person_name',
                        'profile.person.lastname',
                        'profile.person.phone',
                        'profile.person.person_image',
                        'profile.role.id_role',
                        'profile.role.role_description',
                    ],
                    include: [{
                        model: Profile,
                        attributes: [],
                        where: {
                            id_profile: id
                        },
                        include: [{
                            model: Person,
                            attributes: []
                        },
                        {
                            model: Role,
                            attributes: []
                        }]
                    }],
                    raw: true,
                    transaction: t
                });
            }

            //update the jwt
            const token = await updateJWT(resUser, tokenUser);

            const serialized = serialize('tokenUser', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: 1000 * 60 * 60 * 23,
                path: '/',
                // domain: 'ec2-3-131-141-161.us-east-2.compute.amazonaws.com'
            })

            res.setHeader('Set-Cookie', serialized);
        })
        res.status(200).json({ msg: 'Correctly updated' });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}

export const deleteProfile = async (req, res = response) => {
    const { idProfile } = req.params;

    try {
        await Profile.update({
            profile_state: false
        }, {
            where: {id_profile: idProfile}
        })

        res.status(200).json({
            msg: `Profile deleted`
        });
    } catch (error) {
        return res.status(400).json({
            msg: error.message
        })
    }
}

export const createUserProfile = async (req, res = response) => {
    const {
        email,
        password,
        roleId,
        personName,
        lastname,
        phone,
        lat,
        lng,
        providerName,
        providerDescription,
    } = req.body

    let perImage, provImage
    if(req.files != null) {
        const {
            personImage,
            providerImage
        } = req.files

        perImage = personImage;
        provImage= providerImage;
    }

    let newPerImage, newProvImage;
    if(perImage != null && perImage != undefined) {
        const result = await uploadImage(perImage.tempFilePath);
        newPerImage = result.secure_url;
        fs.unlinkSync(path.join(perImage.tempFilePath));
    } else {
        newPerImage = null;
    }

    if(provImage != null && provImage != undefined) {
        const result = await uploadImage(provImage.tempFilePath);
        newProvImage = result.secure_url;
        fs.unlinkSync(path.join(provImage.tempFilePath));
    } else {
        newProvImage = null;
    }

    try {
         //check if the email already exists
         const emailExists = await Profile.findAll({
            where: { email: email }
        });

        if(emailExists.length != 0) {
            return res.status(400).json({ msg: 'Email already exists' });
        };

        const pass = await encriptPassword(password);

        const user = await sequelize.transaction(async (t) => {
            let newUser;
            if(roleId == 3) {
                const {profileId} = await Provider.create({
                    provider_name: providerName,
                    provider_lat: lat,
                    provider_lng: lng,
                    provider_description: providerDescription,
                    provider_image: newProvImage,
                    profile: {
                        email: email,
                        password: pass,
                        roleId: roleId,
                        profile_state: true,
                        google: false,
                        person: {
                            person_name: personName,
                            lastname: lastname,
                            phone: phone,
                            person_image: newPerImage
                        }
                    }
                }, {
                    include: [{
                        model: Profile,
                        include: [{
                            model: Person
                        }, {
                            model: Role
                        }]
                    }],
                    transaction: t,
                });

                newUser = await Profile.findOne({
                    attributes: {exclude: ['password']},
                    where: {id_profile: profileId},
                    include: [Person, Role],
                    transaction: t
                })
            } else if(roleId == 4) {
                const {profileId} = await Customer.create({
                    customer_lat: lat,
                    customer_lng: lng,
                    profile: {
                        email: email,
                        password: pass,
                        roleId: roleId,
                        profile_state: true,
                        google: false,
                        person: {
                            person_name: personName,
                            lastname: lastname,
                            phone: phone,
                            person_image: null
                        }
                    }
                }, {
                    include: [{
                        model: Profile,
                        include: [{
                            model: Person
                        }]
                    }],
                    transaction: t
                });

                newUser = await Profile.findOne({
                    where: {id_profile: profileId},
                    include: [Person, Role],
                    transactions: t
                });
            }

            return newUser;
        });

        res.status(200).json({
            msg: 'User successfully created',
            user
        })
    } catch (error) {
        return res.status(400).json({msg: error.message})
    }
};

export const getUser = async (req, res = response) => {
    const {idProfile} = req.params;

    try {
        const user = await sequelize.transaction(async(t) => {
            let res = await Profile.findOne({
                attributes: ['email', 'password', 'roleId', 'person.person_name', 'person.lastname', 'person.phone'],
                where: {id_profile: idProfile},
                include: [{
                    model: Person,
                    attributes: [],
                }, {
                    model: Role,
                    attributes: []
                }],
                raw: true,
                transaction: t
            });

            if(res.roleId == 3) {
                res = await Provider.findOne({
                    attributes: [
                        'provider_name', 
                        'provider_image',
                        'provider_description',
                        'provider_lat',
                        'provider_lng',
                        'profile.id_profile',
                        'profile.email',
                        'profile.profile_state',
                        'profile.roleId',
                        'profile.person.person_name',
                        'profile.person.lastname',
                        'profile.person.phone',
                        'profile.person.person_image'
                    ],
                    where: {profileId: idProfile},
                    include: [{
                        model: Profile,
                        attributes: [],
                        include: [{
                            model: Person,
                            attributes: [],
                        }, {
                            model: Role,
                            attributes: []
                        }]
                    }],
                    raw: true,
                    transaction: t
                })
            };

            if(res.roleId == 4) {
                res = await Customer.findOne({
                    attributes: [
                        'customer_lat',
                        'customer_lng',
                        'profile.id_profile',
                        'profile.email',
                        'profile.profile_state',
                        'profile.roleId',
                        'profile.person.person_name',
                        'profile.person.lastname',
                        'profile.person.phone',
                        'profile.person.person_image'
                    ],
                    where: {profileId: idProfile},
                    include: [{
                        model: Profile,
                        attributes: [],
                        include: [{
                            model: Person,
                            attributes: [],
                        }, {
                            model: Role,
                            attributes: [],
                        }]
                    }],
                    raw: true,
                    transaction: t
                })
            };
            return res;
        })

        res.status(200).json({ user })
    } catch (error) {
        return res.status(400).json({msg: error.message})
    }
}

export const setUser = async (req, res = response) => {
    const { idProfile } = req.params;

    const {
        email,
        password,
        roleId,
        personName,
        lastname,
        phone,
        lat,
        lng,
        providerName,
        providerDescription
    } = req.body;

    let providerImage, personImage, providerId, customerId, resUser;
    if(req.files != null) {
        const {providerImage: provImg, personImage: perImg} = req.files;
        providerImage = provImg;
        personImage = perImg;
    }

    let updateData = {roleId: roleId};

    //search profile
    const {personId, roleId: idRole, password: pass, person_image} = await Profile.findOne({
        attributes: ['id_profile', 'personId', 'roleId', 'password', 'person.person_image'],
        where: {id_profile: idProfile},
        include: [{
            model: Person,
            attributes: []
        }],
        raw: true
    });

    if(personName != null || personName != '') updateData.person_name = personName;
    if(lastname != null || lastname != '') updateData.lastname = lastname;
    if(email != null || email != '') updateData.email = email;
    if(password != null || password != '') {

        const compare = await decryptPassword(password, pass);
        if(!compare) {
            const hash = await encriptPassword(password)
            if(hash) {
                updateData.password = hash;
            }
        }
    }
    if(phone != null || phone != '') updateData.phone = phone;
    if(personImage != null && personImage != undefined && person_image != '' && person_image != null) {
        const resDelete = await deleteImage(person_image);
        if(resDelete) {
            const result = await uploadImage(personImage.tempFilePath);
            updateData.person_image = result.secure_url;
            fs.unlinkSync(path.join(personImage.tempFilePath));
        }
    }

    //validate the role
    if(idRole == 4) {
        const {id_customer} = await Customer.findOne({
            attributes: ['id_customer'],
            where: {profileId: idProfile}
        });

        customerId = id_customer;

        if(lat != null || lat != '') updateData.customer_lat = lat;
        if(lng != null || lng != '') updateData.customer_lng = lng;

    } else if(idRole == 3) {
        const {id_provider, provider_image} = await Provider.findOne({
            attributes: ['id_provider', 'provider_image'],
            where: {profileId: idProfile}
        });

        providerId = id_provider;

        if(providerName != null || providerName != '') updateData.provider_name = providerName;
        if(providerDescription != null || providerDescription != '') updateData.provider_description = providerDescription;

        if(lat != null || lat != '') updateData.provider_lat = lat;
        if(lng != null || lng != '') updateData.provider_lng = lng;

        if(providerImage != null && providerImage != undefined && provider_image != null && provider_image != '') {
            const resDelete = await deleteImage(provider_image);
            if(resDelete) {
                const result = await uploadImage(providerImage.tempFilePath);
                updateData.provider_image = result.secure_url;
                fs.unlinkSync(path.join(providerImage.tempFilePath));
            }
        }
    }

    //make the corresponding updates
    try {
        await sequelize.transaction(async (t) => {
            await Person.update(updateData, {
                where: { id_person: personId },
                transaction: t
            })

            await Profile.update(updateData, {
                where: { id_profile: idProfile },
                transaction: t
            })

            resUser = await Profile.findOne({
                where: { id_profile: idProfile },
                attributes: ['id_profile',
                            'email',
                            'password',
                            'profile_state',
                            'google',
                            'person.id_person',
                            'person.person_name',
                            'person.lastname',
                            'person.phone',
                            'person.person_image',
                            'role.id_role',
                            'role.role_description'
                        ],
                include: [
                    {
                        model: Person,
                        attributes: []
                    },
                    {
                        model: Role,
                        attributes: []
                    }],
                raw: true,
                transaction: t
            });

            if(roleId == 4) {
                await Customer.update(updateData, {
                    where: { id_customer: customerId },
                    transaction: t
                });

                resUser = await Customer.findOne({
                    attributes: [
                        'id_customer',
                        'customer_lat',
                        'customer_lng',
                        'profile.id_profile',
                        'profile.profile_state',
                        'profile.email',
                        'profile.google',
                        'profile.person.id_person',
                        'profile.person.person_name',
                        'profile.person.lastname',
                        'profile.person.phone',
                        'profile.person.person_image',
                        'profile.role.id_role',
                        'profile.role.role_description',
                    ],
                    include: [{
                        model: Profile,
                        attributes: [],
                        where: {
                            id_profile: idProfile
                        },
                        include: [{
                            model: Person,
                            attributes: []
                        },
                        {
                            model: Role,
                            attributes: []
                        }]
                    }],
                    raw: true,
                    transaction: t
                });
            } else if(roleId == 3) {
                await Provider.update(updateData, {
                    where: { id_provider: providerId },
                    transaction: t
                });

                resUser = await Provider.findOne({
                    attributes: [
                        'id_provider',
                        'provider_name',
                        'provider_image',
                        'provider_description',
                        'provider_lat',
                        'provider_lng',
                        'profile.id_profile',
                        'profile.profile_state',
                        'profile.email',
                        'profile.google',
                        'profile.person.id_person',
                        'profile.person.person_name',
                        'profile.person.lastname',
                        'profile.person.phone',
                        'profile.person.person_image',
                        'profile.role.id_role',
                        'profile.role.role_description',
                    ],
                    include: [{
                        model: Profile,
                        attributes: [],
                        where: {
                            id_profile: idProfile
                        },
                        include: [{
                            model: Person,
                            attributes: []
                        },
                        {
                            model: Role,
                            attributes: []
                        }]
                    }],
                    raw: true,
                    transaction: t
                });
            }
        })
        res.status(200).json({ msg: 'Correctly updated' });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}
