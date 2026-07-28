import { Model } from "mongoose";
import { IBaseRepository } from "../interfaces/base-repository.interface";

export abstract class BaseRepository<T> implements IBaseRepository<T> {
    constructor(protected readonly _model: Model<T>) { }

    async findById(id: string): Promise<T | null> {
        return await this._model.findById(id).exec();
    }

    async findAll(): Promise<T[]> {
        return await this._model.find().exec();
    }

    async create(data: Partial<T>): Promise<T> {
        return await this._model.create(data);
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        return await this._model.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<T | null> {
        return await this._model.findByIdAndDelete(id).exec();
    }

    async findByIds(ids: string[]): Promise<T[]> {
        return await this._model.find({ _id: { $in: ids } }).exec();
    }
}