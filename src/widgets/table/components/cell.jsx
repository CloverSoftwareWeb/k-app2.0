import {
    Typography
} from "@material-tailwind/react";
import React from 'react';

function Cell({ entity }) {
    return (
        <div>
            <Typography className="text-xs font-semibold text-blue-gray-600">
                {entity}
            </Typography>
        </div>
    )
}

export default Cell
