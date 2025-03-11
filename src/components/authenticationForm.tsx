import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { upperFirst, useToggle } from "@mantine/hooks";
import { GoogleButton } from "./GoogleButton";
import {
  signInWithGoogle,
  registerWithEmail,
  loginWithEmail,
} from "@/auth/authService";

interface AuthenticationFormProps extends PaperProps {
  setUser: (user: any) => void; // Replace `any` with an actual user type if possible
}

export function AuthenticationForm({
  setUser,
  ...props
}: AuthenticationFormProps) {
  const handleSignIn = async () => {
    const user = await signInWithGoogle();
    if (user) setUser(user);
  };
  const [type, toggle] = useToggle(["login", "register"]);
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  const handleEmailAuth = async () => {
    const { email, password } = form.values;
    try {
      let user;
      if (type === "register") {
        user = await registerWithEmail(email, password);
      } else {
        user = await loginWithEmail(email, password);
      }
      setUser(user); // Set user after successful authentication
    } catch (error: any) {
      form.setErrors({ email: error.message }); // Display Firebase error
    }
  };

  return (
    <Paper
      radius="md"
      p="xl"
      withBorder
      style={{
        maxWidth: 400, // Set a max width
        width: "100%", // Allow responsiveness
        margin: "auto", // Center horizontally
      }}
      {...props}
    >
      <Text size="lg" fw={500}>
        Welcome to SHIFTORI, {type} with
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton onClick={handleSignIn} radius="xl">
          Google
        </GoogleButton>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(handleEmailAuth)}>
        <Stack>
          {type === "register" && (
            <TextInput
              label="Name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) =>
                form.setFieldValue("name", event.currentTarget.value)
              }
              radius="md"
            />
          )}

          <TextInput
            required
            label="Email"
            placeholder="hello@mantine.dev"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            error={form.errors.email && "Invalid email"}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            error={
              form.errors.password &&
              "Password should include at least 6 characters"
            }
            radius="md"
          />

          {type === "register" && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) =>
                form.setFieldValue("terms", event.currentTarget.checked)
              }
            />
          )}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor
            component="button"
            type="button"
            c="dimmed"
            onClick={() => toggle()}
            size="xs"
          >
            {type === "register"
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
