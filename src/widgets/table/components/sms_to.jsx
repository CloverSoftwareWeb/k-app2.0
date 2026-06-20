import { Common } from "@/constant/strings";
import { useDate } from "../../../hooks/useDate";
import { useFirestoreQuery } from "@/hooks/useFirestoreQuery";
import {
    Typography
} from "@material-tailwind/react";

function SmsTo({ phone, date, name }) {

    const { addNewDocument } = useFirestoreQuery(Common.collectionName.messageHistory);
    const { getCurrentDataAndTime } = useDate();

    const message = `ಕಾರ್ಮಿಕ ಕಾರ್ಡ್ ನವೀಕರಣ ಅಧಿಸೂಚನೆ \n\n ದಿನಾಂಕ: ${date}  ನಿಮ್ಮ ಕಾರ್ಡ್ ಅವಧಿ ಮುಗಿಯುತ್ತದೆ. \n\n ದಯವಿಟ್ಟು ಕೂಲಿ ಕಾರ್ಮಿಕ ಸಂಘ ಹುರುಳಿಸಾಲ್ ಗೆ ಭೇಟಿ ನೀಡಿ!!`;
    const smsUrl = `sms:${phone}?body=${encodeURIComponent(message)}`;

    const addHistory = () => {
        addNewDocument({
            name: name,
            phoneNo: phone,
            timeline: getCurrentDataAndTime()
        });
    };

    return (
        <div>
            <Typography className="text-xs font-semibold text-red-600">
            <a href={smsUrl} onClick={addHistory}>Send SMS</a>
            </Typography>
        </div>
    )
}

export default SmsTo
