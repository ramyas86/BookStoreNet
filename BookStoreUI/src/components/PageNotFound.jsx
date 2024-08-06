import React from "react";
import image404 from './images/404.jpg';
import MediaQuery from "react-responsive";

const PageNotFound = () => {
    const style404 = {
        fontSize: 72,
        fontWeight: 'bold'
    };
    return (
        <>
            <div style={{ textAlign: 'center' }} className="mt-5">
                <MediaQuery maxWidth={575}>
                    <h2 style={{ textAlign: 'center', marginTop: "100px" }}>Page not found</h2>
                    <div style={style404}>404</div>
                </MediaQuery>
                <MediaQuery minWidth={576}>
                    <img src={image404} alt="" className="mb-5" style={{ marginTop: "100px" }} />
                </MediaQuery>
            </div>
        </>
    );
}

export default PageNotFound;