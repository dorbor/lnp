//jshint esversion:7
module.exports = {
    isEmpty: (obj) => {
        for(let key in obj){
            if(obj.hasOwnProperty(key)){
                return false;
            }
        }
        return true;
    }
};