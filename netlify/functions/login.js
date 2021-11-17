"use strict"

const headers = require('./headersCORS');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.handler = async (event, context) => {

  if (event.httpMethod == "OPTIONS") {
    return {statusCode: 200,headers,body: "OK"};
  }

  try {
		
		const data = JSON.parse(event.body);

    if (!(data.email && data.password)) {
      return { statusCode: 400, headers, body:"All input is required"};
    }

    let user = {'_id':1,'password':'','token':''};
    user.password = await bcrypt.hash('12345', 10);

    if (await bcrypt.compare(data.password, user.password)) {
      const token = jwt.sign(
         { user_id: user._id, email:data.email },
         process.env.TOKEN_KEY,
         {
           expiresIn: "2h",
         }
       );
      return { statusCode: 200, headers, body: token};
    }
		return { statusCode: 400, headers, body: 'Invalid Credentials' };
  } catch (error) {
    console.log(error);
    return { statusCode: 422, headers, body: JSON.stringify(error) };
  }
};