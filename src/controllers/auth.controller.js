import { response } from "express"
import { Profile } from "../models/Profile.js";
import { generateJWT } from "../helpers/generate-jwt.js";
import { Person } from "../models/Person.js";
import { Role } from "../models/Role.js";
import { serialize } from "cookie"
import { verify } from "jsonwebtoken";
import { googleVerify } from "../helpers/google-verify.js";
import { Provider } from "../models/Provider.js";
import { Customer } from "../models/Customer.js";
import { decryptPassword, encriptPassword } from "../utils/bcryp.js";
import { Service } from "../models/Service.js";
import { Op } from "sequelize";
import AWS from 'aws-sdk';
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    SES: new AWS.SES({
        region: 'us-east-1',
        credentials: {
            accessKeyId: 'AKIAT5YN6ZSDPA2ISI6N',
            secretAccessKey: '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'
        }
    })
})

export const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        //check if the user name exists
        let profile = await Profile.findOne({
            where: { email },
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
            raw: true
        });

        if( !profile ) {
            return res.status(400).json({
                msg: 'There is no account registered with that email address'
            });
        }

        //if profile is inactive
        if(!profile.profile_state) {
            return res.status(400).json({
                msg: 'Profile is inactive'
            });
        }

        //check password
        const validPassword = await decryptPassword( password, profile.password);
        if(!validPassword) {
            return res.status(400).json({
                msg: 'Incorrect Email / Password'
            });
        }

        // check role
        if(profile.role_description === 'PROVIDER') {
            profile = await Provider.findOne({
                attributes: [
                    'id_provider',
                    'provider_name',
                    'provider_image',
                    'provider_description',
                    'provider_lat',
                    'provider_lng',
                    'provider_zip',
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
                        id_profile: profile.id_profile
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
                raw: true
            })
        }

        if(profile.role_description === 'CUSTOMER') {
            profile = await Customer.findOne({
                attributes: [
                    'id_customer',
                    'customer_lat',
                    'customer_lng',
                    'customer_zip',
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
                        id_profile: profile.id_profile
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
                raw: true
            })
        }


        //generate the jwt
        const token = await generateJWT(profile);
        const serialized = serialize('tokenUser', token, {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 23,
            path: '/',
            // domain: 'boatmate.com'
        })

        res.setHeader('Set-Cookie', serialized)

        return res.json({
            msg: 'Login successfully',
            role: profile.role_description
        });
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

export const getUser = (req, res = response) => {
    const { tokenUser } = req.cookies;

    if(!tokenUser) {
        return res.status(401).json({ msg: 'Unauthorized' })
    }

    try {
        const user = verify(tokenUser, process.env.JWT_SECRET)
        return res.status(200).json({user, tokenUser})
    } catch (error) {
        return res.status(401).json({ msg: 'Invalid token' })
    }
}

export const googleSignIn = async (req, res = response) => {
    const { credential } = req.body;

    let newUser = false;

    try {
        const { name, lastname, email, image } = await googleVerify(credential)

        let user = await Profile.findOne({
            where: { email },
            attributes: ['id_profile',
                        'email',
                        'password',
                        'profile_state',
                        'google',
                        'check_steps',
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
            raw: true
        })
        console.log(user)

        //nonexistent user
        if(!user) {
            const data = {
                person_name: name,
                lastname: lastname,
                phone: '',
                person_image: image
            }

            const person = await Person.create(data)

            const pass = await encriptPassword('123456');

            await person.createProfile({
                email: email,
                password: pass,
                profile_state: true,
                roleId: 5,
                personId: person.dataValues.id_person,
                google: true
            })

            user = await Profile.findOne({
                where: { email },
                attributes: ['id_profile',
                            'email',
                            'password',
                            'profile_state',
                            'google',
                            'check_steps',
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
                raw: true
            })

            newUser = true;
        } else if(!user.profile_state) { //if the user exists but is disabled
            return res.status(401).json({
                msg: 'User is disabled'
            })
        } else {
            // check role
            if(user.role_description === 'PROVIDER') {
                user = await Provider.findOne({
                    attributes: [
                        'id_provider',
                        'provider_name',
                        'provider_image',
                        'provider_description',
                        'provider_lat',
                        'provider_lng',
                        'provider_zip',
                        'profile.id_profile',
                        'profile.profile_state',
                        'profile.email',
                        'profile.google',
                        'profile.check_steps',
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
                            id_profile: user.id_profile
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
                    raw: true
                })
            }

            if(user.role_description === 'CUSTOMER') {
                user = await Customer.findOne({
                    attributes: [
                        'id_customer',
                        'customer_lat',
                        'customer_lng',
                        'customer_zip',
                        'profile.id_profile',
                        'profile.profile_state',
                        'profile.email',
                        'profile.google',
                        'profile.check_steps',
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
                            id_profile: user.id_profile
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
                    raw: true
                })
            }
        }

        //generate the jwt
        const token = await generateJWT(user);
        const serialized = serialize('tokenUser', token, {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 23,
            path: '/',
            // domain: 'boatmate.com'
        })

        res.setHeader('Set-Cookie', serialized)

        res.status(200).json({
            msg: 'Login successfully',
            user,
            newUser
        })
    } catch (error) {
        res.status(401).json({
            msg: error.message
        })
    }
}

export const logout = (req, res = response) => {
    const { tokenUser } = req.cookies;

    if(!tokenUser) {
        return res.status(401).json({ msg: 'Unauthorized' })
    }

    try {
        verify(tokenUser, process.env.JWT_SECRET);

        const serialized = serialize('tokenUser', null, {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
            maxAge: 0,
            path: '/',
            // domain: 'boatmate.com'
        })
        res.setHeader('Set-Cookie', serialized);
        res.status(200).json({ msg: 'Logout Successfully' });
    } catch (error) {
        console.log('Error:', error)
        return res.status(401).json({ msg: 'Invalid token' });
    }

}

export const createProfile = async (req, res = response) => {
    const { email,
            password,
            idRole,
            personName,
            lastname,
            phone,
            lat,
            lng,
            zip,
            providerName,
            services
        } = req.body

    try {

        //check if the email already exists
        const emailExists = await Profile.findAll({
            where: { email: email }
        });

        if(emailExists.length != 0) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        const pass = await encriptPassword(password)

        let user;
        if(idRole == 3) {
            const provider = await Provider.create({
                provider_name: providerName,
                provider_lat: lat,
                provider_lng: lng,
                provider_zip: zip,
                provider_image: null,
                profile: {
                    email: email,
                    password: pass,
                    roleId: idRole,
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
                    }, {
                        model: Role
                    }]
                }],
                returning: true,
            });

            if(services && services.length > 0) {
                const servicesId = services.map((service) => service.id_service);
    
                const existingService = await Service.findAll({
                    where: { id_service: { [Op.in]: servicesId } }
                });
    
                await provider.setServices(existingService);
            } else {
                await provider.setServices([]);
            }

            user = await Provider.findOne({
                attributes: [
                    'id_provider',
                    'provider_name',
                    'provider_image',
                    'provider_description',
                    'provider_lat',
                    'provider_lng',
                    'provider_zip',
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
                where: provider.id_provider,
                include: [{
                    model: Profile,
                    attributes: [],
                    include: [{
                        model: Person,
                        attributes: []
                    },
                    {
                        model: Role,
                        attributes: []
                    }]
                }],
                raw: true
            })
        } else if(idRole == 4) {
            const {id_customer} = await Customer.create({
                customer_lat: lat,
                customer_lng: lng,
                customer_zip: zip,
                profile: {
                    email: email,
                    password: pass,
                    roleId: idRole,
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
                }]
            });

            user = await Customer.findOne({
                attributes: [
                    'id_customer',
                    'customer_lat',
                    'customer_lng',
                    'customer_zip',
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
                where: id_customer,
                include: [{
                    model: Profile,
                    attributes: [],
                    include: [{
                        model: Person,
                        attributes: []
                    },
                    {
                        model: Role,
                        attributes: []
                    }]
                }],
                raw: true
            });
        }

        // generate the jwt
        const token = await generateJWT(user);

        const serialized = serialize('tokenUser', token, {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 4,
            path: '/',
            // domain: 'v2.boatmate.com'
        });

        res.setHeader('Set-Cookie', serialized);

        return res.json({
            msg: 'Register successfully'
        });
    } catch (error) {
        return res.status(400).json({msg: error.message})
    }
}

export const sendMail = async (req, res = response) => {
    const { address, subject } = req.body;

    try {

        const profile = await Profile.findOne({
            where: {email: address}
        });

        if(profile) {
            const info = await transporter.sendMail({
                from: 'tech@boatmate.com',
                to: address,
                subject: subject,
                html: `
                <head>
                    <title>Reset Your Password</title>
                    <style>
                        body {
                            background-color: #109EDA;
                            font-family: Arial, sans-serif;
                            color: #373A85;
                            margin: 0;
                            padding: 0;
                        }
                
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                
                        h1 {
                            color: #00CBA4;
                        }
                
                        .message {
                            background-color: #f8f9fa;
                            padding: 20px;
                            border-radius: 5px;
                        }
                
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            color: #FFFFFF;
                        }
              
                        .btn {
                          color: #FFFFFF !important;
                          font-size: 1rem;
                          background-color: #2196F3;
                          border: 1px solid #2196F3;
                          padding: 0.5rem 1rem;
                          border-radius: 3px;
                          text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Reset Your Password</h1>
                        <div class="message">
                            <p>Hello,</p>
                            <p>We have received a request to reset your password on BoatMate. To complete the password reset process, press the button below:</p>
                            <a class="btn" href='https://boatmate.com/reset-password/${address} target='_blank'>Reset your password</a>
                            <p>If you didn't request to reset your password, please ignore this email and take no further action.</p>
                            <p>If you have any questions or need additional assistance, please contact us at <a href="mailto:tech@boatmate.com">tech@boatmate.com</a>.</p>
                            <p>Thank you and best regards,</p>
                            <p>The BoatMate Team</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2023 BoatMate. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                `
            });
    
            console.log('E-mail sent:', info.messageId);
            res.status(200).json({ msg: 'Email sent successfully' });
        } else {
            res.status(400).json({msg: 'Mail is not registered'})
        }

    } catch (error) {
        console.error('Error sending the e-mail:', error);
        return res.status(400).json({msg: error.message})
    }
}