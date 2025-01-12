import { v4 as uuidv4 } from 'uuid';
import { Breed } from '../types/breedsData';

// Lees de database uit localStorage of initialiseer als lege array
const getDatabase = (): Breed[] => {
    const storedData = localStorage.getItem('database');
    return storedData ? JSON.parse(storedData) : [];
};

const saveDatabase = (data: Breed[]) => {
    localStorage.setItem('database', JSON.stringify(data));
};

export let database: Breed[] = getDatabase();

const randomDelay = () => new Promise((resolve) => setTimeout(resolve, Math.random() * 5000));
const randomError = () => Math.random() < 0.05;

export const create = async (item: Breed) => {
    await randomDelay();
    if (randomError()) {
        throw new Error('An unknown error occurred');
    }
    const newItem = { ...item, id: uuidv4() };
    database.push(newItem);
    saveDatabase(database);
    console.log('database', database);
    return newItem;
};

export const read = async () => {
    await randomDelay();
    if (randomError()) {
        throw new Error('An unknown error occurred');
    }
    return database;
};

export const readOne = async (id: string) => {
    await randomDelay();
    if (randomError()) {
        throw new Error('An unknown error occurred');
    }
    return database.find((item) => item.id === id);
};

export const update = async (id: string, item: Breed) => {
    await randomDelay();
    if (randomError()) {
        throw new Error('An unknown error occurred');
    }
    const index = database.findIndex((item) => item.id === id);
    if (index === -1) return null;
    database[index] = { ...item, id };
    saveDatabase(database); 
    return database[index];
};

export const remove = async (id: string) => {
    await randomDelay();
    if (randomError()) {
        throw new Error('An unknown error occurred');
    }
    const index = database.findIndex((item) => item.id === id);
    if (index === -1) return null;
    const removedItem = database[index];
    database.splice(index, 1);
    saveDatabase(database);
    return removedItem;
};

export const clear = async () => {
    await randomDelay();
    database = [];
    saveDatabase(database);
};
