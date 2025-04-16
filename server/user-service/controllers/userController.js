import bcrypt from 'bcrypt';
import User from '../models/users.js';
import jwt from "jsonwebtoken"


export async function createUser(req,res){

    try{
        const data = req.body;
        data.password = await bcrypt.hashSync(data.password,10);
        const email = data.email;

        const checkEmail = await User.findOne({
            email : email
        })

        if(checkEmail){
            res.json({
                message : "Email is Already use"
            })
            return
        }else{
            const newUser = new User(data);
            await newUser.save();
            res.json({
                message : "Uses Added!"
            })
            return
        }
    }catch(err){
        res.status(500).json({
            err : "User registration failed"
        })
    }





}


export async function userLogin(req,res) {

    try{

        const data = req.body;
        const email = data.email;

        const checkUser = await User.findOne({
            email : email
        })

        if(checkUser){

            const checkPassword = bcrypt.compareSync(
                data.password,checkUser.password
            );

            if(checkPassword){
                const token = jwt.sign(
                    {
                        id : checkUser._id,
                        firstName : checkUser.firstName,
                        lastName : checkUser.lastName,
                        email : checkUser.email,
                        password : checkUser.password,
                        role : checkUser.role,
                        phone : checkUser.phone,
                        image : checkUser.image

                    },
                    process.env.SEKRET_KEY
                );
                res.json({
                    message : "Login successfully",
                    token : token,
                    user : checkUser
                })
                return
            }else{
                res.json({
                    message : "Password incorrect ,please try again!"
                })
                return
            }

        }else{
            res.status(404).json({
                message : "user not found please try again!"
            })
            return
        }
    }catch(err){
        res.status(500).json({
            err : "user Login unsuccessfully!"
        })
    }

}