import "./src/config/db.config.ts";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import {PORT} from "./src/config/env.config.ts";

//import des Routes
import userRouter from "./src/routes/user.route.ts";
import trainRouter from "./src/routes/train.route.ts";
import trainStationRoute from "./src/routes/trainStation.route.ts";
import ticketRouter from "./src/routes/ticket.route.ts";

const app = express();

const swaggerSpec = swaggerJsDoc({
    definition:{
        openapi: "3.0.0",
        info: {
            title: "Blogify API",
            version: "0.0.1",
            description: "A simple Express Library API"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: ["swagger.yaml"]
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//ajout des routes user
app.use("/user", userRouter)

//ajout des routes train
app.use("/train", trainRouter)

//ajout des routes trainStation
app.use("/trainStation", trainStationRoute)

//ajout des routes ticket
app.use("/ticket", ticketRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
