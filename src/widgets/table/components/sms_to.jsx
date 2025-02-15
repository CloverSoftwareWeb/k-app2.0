import {
    Typography
} from "@material-tailwind/react";
import React from 'react';

function SmsTo({ phone, date }) {

    const message = `ಕಾರ್ಮಿಕ ಕಾರ್ಡ್ ನವೀಕರಣ ಅಧಿಸೂಚನೆ \n\n ದಿನಾಂಕ: ${date}  ನಿಮ್ಮ ಕಾರ್ಡ್ ಅವಧಿ ಮುಗಿಯುತ್ತದೆ. \n\n ದಯವಿಟ್ಟು ಕೂಲಿ ಕಾರ್ಮಿಕ ಸಂಘ ಹುರುಳಿಸಾಲ್ ಗೆ ಭೇಟಿ ನೀಡಿ!!`;
    const smsUrl = `sms:${phone}?body=${encodeURIComponent(message)}`;

    return (
        <div>
            <Typography className="text-xs font-semibold text-red-600">
            <a href={smsUrl} >Send SMS</a>
            </Typography>
        </div>
    )
}

export default SmsTo
