"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

export function ModeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <ToggleGroup
            type="single"
            value={theme}
            onValueChange={(value) => {
                if (value) {
                    setTheme(value);
                }
            }}
            className="w-full"
            size={"sm"}
        >
            <ToggleGroupItem value="light">
                <Sun />
            </ToggleGroupItem>
            <ToggleGroupItem value="system">
                <Monitor />
            </ToggleGroupItem>
            <ToggleGroupItem value="dark">
                <Moon />
            </ToggleGroupItem>
        </ToggleGroup>
    );
}
