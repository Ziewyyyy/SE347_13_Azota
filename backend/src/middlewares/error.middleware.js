const errorHandler = (err,req,res,next) => {
    console.error('Error Stack: ',err.stack);

    if (err.name==='ZodError') {
        return res.status(400).json({
            success:false,
            message: 'Dữ liệu không hợp lệ',
            errors: err.errors.map(e=>({
                field: e.path.join('.'),message: e.message
            }))
        });
    }
    const statusCode=err.statusCode||500;
    res.status(statusCode).json({
        success:false,
        message: err.message || "Lỗi máy chủ nội bộ!"
    });
}
module.exports=errorHandler;
