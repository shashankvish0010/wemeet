let actualotp  = require("../Controllers/UserControllers");

const OTPgenerator = async () => {
    const generatedOtp = Number(`${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`)
    actualotp = generatedOtp
}

export default OTPgenerator;