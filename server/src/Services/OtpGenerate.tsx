const OTPgenerator = async () => {
    const generatedOtp = Number(`${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`)
    return generatedOtp
}

module.exports = OTPgenerator;