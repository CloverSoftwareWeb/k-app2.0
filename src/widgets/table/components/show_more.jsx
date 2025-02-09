import {
    Typography
} from "@material-tailwind/react";
import React from 'react';

function ShowMore({ data, visibleRows, handleShowMore }) {
    return (
        <>
            {
                visibleRows < data?.length && (
                    <div className="mt-4 text-center">
                        <button
                            onClick={handleShowMore}
                            className="px-4 py-2 text-black rounded-md hover:bg-gray-200"
                        >
                            <Typography variant="h6" color="gray">
                                show more &#8595;
                            </Typography>
                        </button>
                    </div>
                )
            }
        </>
    )
}

export default ShowMore
