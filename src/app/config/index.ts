

import path from 'path'
import dotenv from 'dotenv'



dotenv.config({path:path.join(process.cwd(), '.env')})

export default {
    NODE_ENV:process.env.NODE_ENV,
    port:process.env.PORT,
    databaseURL: process.env.DATABASE_URL,
    default_password:process.env.DEFAULT_PASSWORD,
    bcrypt_salt_round:process.env.BCRYPT_SALT_ROUNDS,
    secretKey: process.env.JWT_SECRET_KEY,
    jwt_refresh_secret_key:process.env.JWT_REFRESH_SECRET,
    jwt_secret_expires_in:process.env.JWT_SECRET_EXPIRES_IN,
    jwt_refresh_expires_in:process.env.JET_REFRESH_EXPIRES_IN,
    reset_password_ui_link:process.env.RESET_PASSWORD_UI_LINK,
    cloudinary_api_key:process.env.CLOUDINARY_API_KEY,
    cloudinary_cloud_name:process.env.CLOUDINARY_NAME,
    cloudinary_secret:process.env.CLOUDINARY_SECRET,
    suer_admin_password:process.env.SUPER_ADMIN_PASSWORD,
}