import FormInput from "./FormInput";

export default function InstructorTab({ register, errors }) {
    return (
        <div className="space-y-4">
            <FormInput label="Instructor Name" name="instructor" register={register} errors={errors} 
            rules={{ required: "Instructor name is required" }}
            placeholder="Dr. Sarah Johnson" required />

            <FormInput label="Instructor Bio" name="instructorBio" register={register} errors={errors} 
            rules={{ required: "Instructor bio is required" }}
            placeholder="Senior Immigration Consultant" required />
        </div>
    );
}