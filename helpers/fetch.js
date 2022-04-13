const baseURL = process.env.REACT_APP_API_URL

export const fetchWithoutToken = ( endpoint, data, method='GET' ) => {

    const url = `${ baseURL }/${ endpoint }`;

    if ( method === 'GET' ){
        return fetch( url );
    } else {
        return fetch( url , {
            method,
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify( data )
        });
    }

}

export const fetchWithToken = ( endpoint, data, method = 'GET' ) => {

    const url = `${ baseURL }/${ endpoint }`;
    
    var user = JSON.parse(localStorage.getItem('user'));
    var token = user.token;
    
    if ( method === 'GET' ){
        return fetch( url,{
            method,
            headers: {
                'Authorization': `Bearer ${ token }`
            }
        });
    } else {
        return fetch( url , {
            method,
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${ token }`
            },
            body: JSON.stringify( data )
        });
    }

}
