import express from 'express';
import path from 'path'; 
import { connectDB } from './connect.js';
import cookieParse from 'cookie-parser';
import { restrictToLoggedInUserOnly, UserAuth, restrictToLoggedInDevOnly, DevAuth } from './middlewares/auth.js';
import staticRoute from './routes/static_router.js';
import userRoute from './routes/user.js';
import devRoute from './routes/developer.js';
import { admin, app } from './admin.mjs'; 

connectDB('mongodb://localhost:27017/DataSparkStudio').then(() => console.log("Database connected"));

const PORT = 8000;
app.set("view engine", "ejs");
app.set('views', path.resolve("./views")); 

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParse());

app.use('/userhome', restrictToLoggedInUserOnly);
app.use('/devhome', restrictToLoggedInDevOnly);
app.use('/user', userRoute);
app.use('/developer', devRoute);
app.use('/', UserAuth, DevAuth, staticRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}${`/landing_page`}`);
});
