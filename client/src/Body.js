import { Route, Routes } from "react-router-dom";
import A from './A.js';
import B from './B.js';
import C from './C.js';

function Body() {
    return (
        <>
            <Routes>
                {/* <Route path="/" element={}></Route> */}
                <Route path="/a" element={<A />}></Route>
                <Route path="/b" element={<B />}></Route>
                <Route path="/c" element={<C />}></Route>
            </Routes>
        </>
    )
}

export default Body;