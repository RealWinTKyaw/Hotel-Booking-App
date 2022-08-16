import axios from 'axios'
import { enc_json as encrypt, dec_json as decrypt } from './Crypto';

const HOTEL_API =  "https://off-sight.herokuapp.com/api"

async function getData(url = '', query) {
    const data = await axios.get(url, {
        params: query,
    })
    .then(res => res.data)
    .catch(err => err)
    return data
}

async function postData(url = '', body) {
    const data = await axios.post(url, body)
    .then(res => res.data)
    .catch(err => err)
    return data
}

async function getHotelsByDestination(dest) {
    const query = {
        destination_id: dest
    }
    const url = `${HOTEL_API}/hotels`
    return await getData(url, query)
}

async function getHotelPricesByDestination(params) {
    params.partner_id = 1;
    const url = `${HOTEL_API}/hotels/prices`
    return await getData(url, params)
}

async function getHotelById(id) {
    const url = `${HOTEL_API}/hotels/${id}`
    return await getData(url)
}

async function getHotelPrice(id, params) {
    params.partner_id = 1;
    const url = `${HOTEL_API}/hotels/${id}/price`
    return await getData(url, params)
}

async function getUser(user) {
    const uid = user.sub;
    const query = {
        username: user.name,
        email: user.email
    }

    const enc_query = {
        uid: uid,
        info: encrypt(query),
        bookings: encrypt([])
    }
    const url = `${HOTEL_API}/users/${uid}`
    const res = await postData(url, enc_query);

    const dec_user = {
        uid: res.uid,
        info: decrypt(res.info),
        bookings: decrypt(res.bookings),
        image: user.picture
    }
    console.log(dec_user)
    return dec_user
}
async function getBookings(user) {
    const enc_query = {
        uid: user.uid,
        info: encrypt(user.info),
        bookings: encrypt(user.bookings)
    }
    const url = `${HOTEL_API}/users/${user.uid}`
    const res = await postData(url, enc_query);

    const dec_user = {
        uid: res.uid,
        info: decrypt(res.info),
        bookings: decrypt(res.bookings),
        image: user.image
    }
    return dec_user
}

async function deleteUser(uid) {
    const url = `${HOTEL_API}/users/${uid}/del`
    const res = await postData(url);
    return res
}

async function addBooking(uid, booking) {
    const query = {
        booking: encrypt(booking)
    }

    const url = `${HOTEL_API}/users/${uid}/add`
    const res = await postData(url, query)

    const user = {
        uid: res.user.uid,
        info: decrypt(res.user.info),
        bookings: decrypt(res.user.bookings)
    }

    return [user, decrypt(res.booking)]
}

const api = {
    getData, postData,
    getHotelsByDestination, getHotelPricesByDestination, 
    getHotelById, getHotelPrice,
    getUser, deleteUser,
    addBooking, getBookings};
export default api;


