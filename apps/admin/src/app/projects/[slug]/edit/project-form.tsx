"use client";

import { useRouter } from "next/navigation";
import { Router } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ProjectData } from "@/database";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { updateProjectData } from "../actions";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(10).max(500),
  overrideDescription: z.coerce.boolean(),
  url: z.string().url(),
  overrideURL: z.coerce.boolean(),
  logo: z.string(),
  comments: z.string(),
});

type Props = {
  project: ProjectData;
};
export function ProjectForm({ project }: Props) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: project,
  });

  const isPending = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    await updateProjectData(project.id, values);
    toast.success("Project updated");
    router.push(`/projects/${project.slug}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project data</CardTitle>
        <CardDescription>
          <code>{project.id}</code>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="overrideDescription"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Override description</FormLabel>
                    <FormDescription>
                      Used to override the description coming from GitHub data
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <Input placeholder="Logo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="overrideURL"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Override URL</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" aria-disabled={isPending}>
              {isPending && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending}>
      {pending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
      Save
    </Button>
  );
}
