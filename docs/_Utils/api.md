# 📘 `ApiError` Class Documentation

::: section
## 🔧 Constructor

`new ApiError(data: Record<string, unknown> | string, status: number)`

Constructs a new API error, storing the associated data and HTTP status
code.
:::

::: section
## ⚠️ `violationsFor(field: string): string[]`

Returns validation error messages for a given field.

**Example:**

    const err = new ApiError({
          violations: [
            { propertyPath: "email", message: "Invalid email format." },
            { propertyPath: "email", message: "Email already in use." }
          ]
        }, 400);
        
        console.log(err.violationsFor("email"));
        // Result: ["Invalid email format.", "Email already in use."]
:::

::: section
## 🧠 `get name(): string`

Returns a formatted error name based on the `title` and `detail`
properties of the data.

**Examples:**

    new ApiError({ title: "Error", detail: "Invalid email" }, 400).name;
        // Result: "Error: Invalid email"
        
        new ApiError({ title: "Error" }, 500).name;
        // Result: "Error"
        
        new ApiError({}, 500).name;
        // Result: "Unknown Error"
:::

::: section
## 📋 `get allViolations(): Record<string, string[]>`

Returns all violations as an object structured by field.

**Example:**

    const err = new ApiError({
          violations: [
            { propertyPath: "email", message: "Email required" },
            { propertyPath: "password", message: "Weak password" }
          ]
        }, 400);
        
        console.log(err.allViolations);
        // Result: {
        //   email: ["Email required"],
        //   password: ["Weak password"]
        // }
:::
