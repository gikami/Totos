const nodemailer = require("nodemailer");
class Mail {
    async send(text) {
        if (text && text.length > 0) {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.yandex.ru",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: 'asmkontekst@yandex.ru', // generated ethereal user
                    pass: 'one234567890', // generated ethereal password
                },
            })
            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Заявка с сайта Totos" <asmkontekst@yandex.ru>', // sender address
                to: "asmkontekst@yandex.ru", // list of receivers
                subject: "Заявка с сайта Totos",
                html: text, // html body
            })
            if (info) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
}
module.exports = new Mail()