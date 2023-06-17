const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://eduardokash:projetoweb@cluster0.kptier4.mongodb.net/?retryWrites=true&w=majority";
const COLLECTION_NAME = "usuarios";

async function withMongoDb(callback) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db("socialblend");
    const collection = db.collection(COLLECTION_NAME);
    return await callback(collection);
  } catch (err) {
    console.error("Erro ao trabalhar com o MongoDB:", err);
    throw err;
  } finally {
    await client.close();
  }
}

async function atualizarPerfil(emailUsuario, nomeUsuario, dataNasc) {
  try {
    await withMongoDb(async (collection) => {
      await collection.updateOne(
        { email: emailUsuario },
        { $set: { nome: nomeUsuario, data: dataNasc } }
      );
      console.log("Perfil atualizado com sucesso.");
      console.log(nomeUsuario);
    });
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    throw err;
  }
}



function readData() {
  return withMongoDb(async (collection) => {
    const data = await collection.find({}).toArray();
    return data;
  });
}

function writeData(data) {
  return withMongoDb(async (collection) => {
    await collection.deleteMany({});
    await collection.insertMany(data);
  });
}

async function findUserByEmail(email) {
  return await withMongoDb(async (collection) => {
    return await collection.findOne({ email: email });
  });
}

async function findUserById(id) {
  return await withMongoDb(async (collection) => {
    return await collection.findOne({ id: id });
  });
}

module.exports = {
  readData,
  writeData,
  findUserByEmail,
  findUserById,
  atualizarPerfil,
};