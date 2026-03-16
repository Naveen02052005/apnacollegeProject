// function wrapAsync(fn){
//     return function(req,res,next){
//         fn(req,res,next).catch(next);
//     }
// }

//  Or directly we can export


module.exports = (fn) => {
    return (req,res,next) => {
        fn(req,res,next).catch(next);
    }
}