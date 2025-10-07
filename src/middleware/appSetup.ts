import cors from "cors";
import morgan from "morgan";
import express from "express";
import type {Express} from "express";

export const setupApp =(app:Express):void=>{
    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(morgan('dev'));
}