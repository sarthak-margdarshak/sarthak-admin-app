// @mui
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

const style = {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    bgcolor: "background.paper",
    border: "2px solid #f6f6f6",
    borderRadius: "20px",
    boxShadow: 24,
    p: 4,
    gap: "1rem",
};

export default function CreateCouponModal({ open, setOpen }) {
    const handleClose = () => setOpen(false);

    return (
        <div>
            {/* <Button onClick={handleOpen}>Open modal</Button> */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <TextField required id="coupon_name" label="Coupon Name" />
                    <TextField required id="valid_from" label="Valid From" />
                    <TextField required id="valid_to" label="Valid To" />
                    <TextField required id="valid_for" label="Valid For" />
                    <Button variant="contained">ADD COUPON</Button>
                </Box>
            </Modal>
        </div>
    );
}
