const User = require('../models/user');
module.exports.renderRegister = (req,res)=>{
    res.render('users/register');
}
module.exports.register = async(req,res,next)=>{
    try{
    const {email,username,password} = req.body;
    const user = new User({email,username});
    const registerUser = await User.register(user,password);
    req.login(registerUser,err=>{
        if(err) return next(err);
        req.flash('Success','Welcome to Camps Engine');
        res.redirect('/campgrounds');
    })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
   
}
module.exports.renderLogin = (req,res)=>{
    res.render('users/login');
}
module.exports.login = (req,res)=>{
    req.flash('Success','Welcome back!');
    res.redirect('/campgrounds');
}
module.exports.logout = (req,res)=>{ 
    req.logout(err=>{
        if(err){return next(err);}
        req.flash('Success','Goodbye');
        res.redirect('/campgrounds')
    });
}