"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getProviders, signIn } from "next-auth/react";

const LoginForm = ({
  providers,
}: {
  providers: Awaited<ReturnType<typeof getProviders>>;
}) => {
  return (
    <form>
      <FieldGroup>
        <Field>
          {providers &&
            Object.values(providers).map((provider) => (
              <Button
                key={provider.name}
                variant="outline"
                type="button"
                className="cursor-pointer"
                onClick={() =>
                  signIn(provider.id, {
                    callbackUrl: "/search/b4792ba9-89bd-4cf5-a036-d8277069d676",
                  })
                }
              >
                Login with {provider.name}
              </Button>
            ))}
          <FieldDescription className="text-center">
            Don&apos;t have an account? <a href="#">Sign up</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default LoginForm;
