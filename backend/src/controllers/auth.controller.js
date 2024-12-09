

import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import {Students} from "../models/student.model.js";
import {Professor} from "../models/professor.model.js";
import bcrypt from "bcrypt";





const generateAccessAndRefereshTokens = async(userId, role) =>{
    // let user;
    try {
        
        let user;
        if(role === 'student'){
            user = await Students.findById(userId)
        }else{
            user = await Professor.findById(userId)
            
        }
        // const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const loginUser = asyncHandler(async(req, res) => {
    const { email, password, role } = req.body;

   
    if(!email || !password || !role) {
        throw new ApiError(400, "Email, Password, and User Type are required");
    }

    let user;
    
    if (role === 'student') {
        user = await Students.findOne({ email }).select('+password');
    } else if (role === 'professor') {
        user = await Professor.findOne({ email }).select('+password');
    } else {
        throw new ApiError(400, "Invalid user type");
    }

   console.log(user);
    if(!user || !(await bcrypt.compare(password, user.password))){
        throw new ApiError(401, "Invalid Credentials");
    }

    
    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id, role);

    const loggedInUser = { 
        ...user.toObject(), 
        password: undefined, 
        refreshToken: undefined 
    };

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, 
                accessToken, 
                refreshToken
            },
            "User logged In Successfully"
        )
    )
})


const signInStudent = asyncHandler(async(req, res) => {

    const {student_name, enrollment_no, email,major, graduation_year, birth_date, password} =  req.body;

    if([student_name, enrollment_no, major, graduation_year, email, birth_date].some((field)=>{field?.trim === ""})){
        throw new ApiError(400, "All fields are required")
       
    }

    const existedStudent  = await Students.findOne({enrollment_no})

    if(existedStudent){
        throw new ApiError(409, "Student Already Exists");
        
    }

    const student = await Students.create({
        student_name,
        enrollment_no,
        email,
        major,
        graduation_year,
        birth_date,
        password

    });

    // const user = await User.create({
    //     email,
    //     password: birth_date, 
    //     role: 'student',
    //     student: student._id 
    // });

    const createdStudent = await Students.findById(student._id)
    // const createdUser = await user.findById(user._id)

    if(!createdStudent){
        throw new ApiError(500, "Something Went Wrong While Registering The Student");
       
    }

    return res.status(201).json(
        new ApiResponse(200, createdStudent,"Student Registered SuccessFully")
    )
})







const signInProfessor = asyncHandler(async (req, res) => {
    
    const {professor_name, contact_no, email, department, password} =  req.body;

    if([professor_name, contact_no, email, department, password].some((field)=>{field?.trim === ""})){
        throw new ApiError(400, "All fields are required")
       
    }

    const existedProfessor  = await Professor.findOne({email})

    if(existedProfessor){
        throw new ApiError(409, "Faculty Already Exists");
        
    }

    const professor = await Professor.create({
        professor_name, 
        contact_no, 
        email, 
        department, 
        password

    });

    // const user = await User.create({
    //     email,
    //     password, 
    //     role: 'professor',
    //     professor: profesor._id 
    // });

    const createdProfessor = await Professor.findById(professor._id)
    // const createdUser = await user.findById(user._id)

    if(!createdProfessor){
        throw new ApiError(500, "Something Went Wrong While Registering The Professor");
       
    }

    return res.status(201).json(
        new ApiResponse(200, createdProfessor,"Professor Registered SuccessFully")
    )


})



export {loginUser, signInStudent, signInProfessor};

