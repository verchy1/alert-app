import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import BtnAddTodo from "./btnUtilitiTodo";

export default function ItemComplet({ id, title, description, date, localite, Observation }) {
    return (
        <div className="row mt-3 p-3" style={{ border: "1px solid rgba(161, 163, 171, 0.63)", borderRadius: "10px", width: "100%" }}>
            <div className="container">
                <div className="row d-flex justify-content-between align-items-center text-center">
                    <div className="col-2 col-sm-1 d-flex justify-content-start">
                        <CircleOutlinedIcon style={{ fontSize: 30, color: "red" }} />
                    </div>
                    <div className="col-10 col-sm-11 d-flex justify-content-end">
                        <p className='fw-bold text-truncate' style={{ fontSize: "16px" }}>{title}</p>
                    </div>
                </div>
                <div className="row text-center">
                    <p className='fw-light p-1 text-center' style={{
                        maxWidth: '100%',
                        maxHeight: '50px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: "14px"
                    }}>
                        {description} | {Observation} | {localite}
                    </p>
                </div>
                <div className="row">
                    <div className="col-6 d-flex justify-content-start">
                        <p style={{ fontSize: "13px" }}>
                            <span className='fw-bold'>Status :</span> <span className='text-danger'>Terminer</span>
                        </p>
                    </div>
                    <div className="col-6 d-flex justify-content-end">
                        <p className='text-secondary' style={{ fontSize: "13px" }}>{date}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
