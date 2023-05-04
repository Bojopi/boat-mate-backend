import { response } from "express";
import { Person } from "../models/Person.js";
import { Profile } from "../models/Profile.js";
import { Provider } from "../models/Provider.js";
import { Customer } from "../models/Customer.js";
import { searchImage, uploadImage } from "../utils/cloudinary.js";
import { sequelize } from "../database/database.js";
import { decryptPassword, encriptPassword } from "../utils/bcryp.js";
import { updateJWT } from "../helpers/generate-jwt.js";
import { serialize } from "cookie";
import { Role } from "../models/Role.js";

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
        const {providerImage, personImage} = req.files;
        providerImage = providerImage;
        personImage = personImage;
    }

    const { id } = req.params;

    let updateData = {};

    //search profile
    const {personId, roleId, password: pass} = await Profile.findOne({
        attributes: ['id_profile', 'personId', 'roleId', 'password'],
        where: {id_profile: id}
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
    if(personImage != null && personImage != undefined) {
        const imageExist = await searchImage(personImage);
        if(!imageExist) {
            const result = await uploadImage(personImage.tempFilePath);
            updateData.person_image = result.secure_url;
            await fs.unlink(personImage.tempFilePath)
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
        const {id_provider} = await Provider.findOne({
            attributes: ['id_provider'],
            where: {profileId: id}
        });

        providerId = id_provider;

        if(providerName != null || providerName != '') updateData.provider_name = providerName;
        if(providerDescription != null || providerDescription != '') updateData.provider_description = providerDescription;

        if(lat != null || lat != '') updateData.provider_lat = lat;
        if(lng != null || lng != '') updateData.provider_lng = lng;

        if(providerImage != null && providerImage != undefined) {
            const imageExist = await searchImage(providerImage);
            if(!imageExist) {
                const result = await uploadImage(providerImage.tempFilePath);
                updateData.provider_image = result.secure_url;
                await fs.unlink(providerImage.tempFilePath)
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
                        'zip',
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
                maxAge: 1000 * 60 * 1,
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

