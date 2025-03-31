import { db } from "./firebaseConfig.js";
import { collection, doc, setDoc } from "firebase/firestore";
import fs from "fs";
import csv from "csv-parser";

async function cargarCSV() {
    const results = [];

    fs.createReadStream("./archivo.csv")
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("error", (error) => console.error("Error leyendo el archivo CSV:", error)) // Manejo de errores en lectura
        .on("end", async () => {
            try {
                for (const row of results) {
                    const docRef = doc(collection(db, "productos"), row.code.toString()); // Asegurar que sea string
                    await setDoc(docRef, {
                        item: row.item,
                        code: row.code, // No se necesita convertirlo
                        line: row.line,
                        family: row.family,
                        und: row.und,
                        price: parseFloat(row.price) || 0, // Evita errores si el campo está vacío
                        iva: parseFloat(row.iva) || 0,
                        weight: parseFloat(row.weight) || 0,
                        state: row.state,
                        format: row.format,
                        color: row.color,
                        description: row.description, // Corrección del nombre del campo
                        specification: [{ clave: "valor" }],
                    });
                }
                console.log("Carga masiva completada 🚀");
            } catch (e) {
                console.error("Error al insertar datos en Firestore:", e);
            }
        });
}

cargarCSV();
