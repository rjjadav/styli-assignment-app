import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Schema as MongooseSchema } from 'mongoose';


@Schema({timestamps: true})
export class Category {
    @Prop({required: true, trim: true})
    name: string

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: "category", default: null })
    parentId: MongooseSchema.Types.ObjectId
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// export const CategorySchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     parentId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Category',
//         default: null // Top-level categories will have parentId as null
//     }
// }, {
//     timestamps: true // Automatically add createdAt and updatedAt fields
// });