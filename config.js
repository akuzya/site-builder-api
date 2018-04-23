module.exports = {
    appPort:'2434',
    multer: {
        dest: './uploads/'
    },
    mongoUrl: "mongodb://localhost/xsollasitebuilder",
    session: {
        secret: 'Tf648693576ygvr%$%^&uh',
        name: 'xsollasb.sid',
        proxy: true,
        resave: true,
        saveUninitialized: true
    },
    appSalt: "hb^hbfG^4F578356ghfr&8y6tgNmj"
};