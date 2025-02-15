import { Common } from "@/constant/strings";
import { useDate } from "../../../hooks/useDate";
import { useFirestoreQuery } from "@/hooks/useFirestoreQuery";
import {
    Typography
} from "@material-tailwind/react";
import React from 'react';

function CallTo({ phone, name }) {

    const { addNewDocument } = useFirestoreQuery(Common.collectionName.callHistory)
    const { getCurrentDataAndTime } = useDate()

    const addHistory = () => {
        addNewDocument({
            name: name,
            timeline: getCurrentDataAndTime()
        })
    }
    return (
        <div>
            <Typography className="text-xs font-semibold text-green-600">
                <a href={`tel:${phone}`} onClick={addHistory}>Call</a>
            </Typography>
        </div>
    )
}

export default CallTo
