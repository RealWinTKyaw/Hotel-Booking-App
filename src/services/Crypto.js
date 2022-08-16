import CryptoJS from "crypto-js/";

const key = "w9z$C&F)J@NcRfUjXnZr4u7x!A%D*G-K" /* 32 characters long (256 bytes)*/ 

const encrypt = (pt)=>{
    return CryptoJS.AES.encrypt(pt, key).toString();
};

const decrypt =(ct)=>{
    return CryptoJS.AES.decrypt(ct, key).toString(CryptoJS.enc.Utf8);
};

const enc_json = (obj) => {
    return encrypt(JSON.stringify(obj))
}

const dec_json = (str) => {
    return JSON.parse(decrypt(str))
}

export {encrypt, decrypt, enc_json, dec_json};