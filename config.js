module.exports = {
    appPort:'5757',
    multer: {
        dest: './uploads/'
    },
    mongoUrl: "mongodb://localhost/mssitecreator",
    session: {
        secret: 'Tf6486976ygvr%$%^&uh',
        name: 'timecalc.sid',
        proxy: true,
        resave: true,
        saveUninitialized: true
    },
    appSalt: "hb^hbfG^4F578ghfr&8y6tgNmj"
};