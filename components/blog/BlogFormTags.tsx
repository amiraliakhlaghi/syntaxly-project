"use client";

import { UseFormRegister } from "react-hook-form";
import { tags } from "@/lib/tags";
import { BlogSchemaType } from "@/schemas/BlogSchema";

type BlogFormTagsProps = {
  register: UseFormRegister<BlogSchemaType>;
};

const BlogFormTags = ({ register }: BlogFormTagsProps) => {
  return (
    <fieldset className="flex flex-col border-y mb-4 py-2">
      <legend>Select 4 Tags</legend>
      <div className="flex gap-4 flex-wrap w-full">
        {tags.map((tag) => {
          if (tag === "All") return null;

          return (
            <label key={tag} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={tag}
                {...register("tags")}
                disabled={false}
              />
              <span>{tag}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};

export default BlogFormTags;
