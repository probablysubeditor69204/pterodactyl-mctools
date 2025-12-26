# McTools - Pterodactyl Addon

A powerful Pterodactyl Panel addon that allows server owners to easily browse, search, and install Minecraft mods, plugins, resource packs, data packs, shaders, and modpacks directly from **Modrinth** and **CurseForge** within their server management interface.

![McTools Banner](https://via.placeholder.com/800x200/1a1f2e/00d4ff?text=McTools+for+Pterodactyl)

## ✨ Features

### 🎮 Multi-Category Support
- **Mods** - Browse and install Minecraft mods
- **Plugins** - Server-side plugins (Bukkit, Spigot, Paper, etc.)
- **Resource Packs** - Texture and resource packs
- **Data Packs** - Minecraft data packs
- **Shaders** - Shader packs for enhanced graphics
- **Modpacks** - Complete modpack installations

### 🔍 Advanced Search & Filtering
- **Dual Provider Support** - Switch between Modrinth and CurseForge
- **Smart Search** - Real-time search across both platforms
- **Sorting Options**:
  - Downloads (Most Popular)
  - Relevance (Best Match)
  - Last Updated (Newest Updates)
- **Top Pagination** - Easy navigation through search results

### 🎨 Native Pterodactyl UI
- Seamlessly integrated with Pterodactyl's design language
- Uses native color tokens and styling
- Responsive layout that matches the panel's aesthetic
- Consistent with Pterodactyl's GreyRowBox components

### ⚙️ Admin Controls
- Configure Modrinth and CurseForge API keys
- Manage addon settings from the admin panel
- Easy setup and configuration

### 🚀 One-Click Installation
- Install mods, plugins, and packs with a single click
- Automatic file placement in correct directories
- Version-aware installations

## 📸 Screenshots

*Coming soon - Screenshots of the addon in action*

## 📋 Requirements

- Pterodactyl Panel v1.x
- PHP 8.0 or higher
- Composer
- Node.js & npm/yarn (for frontend compilation)

## 🔧 Installation

See [INSTALL.md](INSTALL.md) for detailed installation instructions.

## 🎯 Usage

1. Navigate to your Minecraft server in the Pterodactyl panel
2. Click on the **"Mctools"** tab in the server navigation
3. Select a category (Mods, Plugins, Resource Packs, etc.)
4. Search for content or browse the listings
5. Click **"Install"** on any item to add it to your server
6. Restart your server to apply changes

## 🔑 API Configuration

### Modrinth
No API key required - works out of the box!

### CurseForge
1. Get your API key from [CurseForge for Studios](https://console.curseforge.com/)
2. Navigate to **Admin Panel → Mctools Settings**
3. Enter your CurseForge API key
4. Save settings

## 🛠️ Features in Detail

### Provider Switching
Toggle between Modrinth and CurseForge to access different content libraries. Each provider has its own unique collection of mods and plugins.

### Plugin Support
The addon intelligently filters server-side plugins when you select the "Plugins" category, showing only compatible plugins for:
- Bukkit
- Spigot
- Paper
- Purpur
- And other server platforms

### Smart Installation
Files are automatically placed in the correct directories:
- Mods → `/mods`
- Plugins → `/plugins`
- Resource Packs → `/resourcepacks`
- Shaders → `/shaderpacks`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Credits

- Built for [Pterodactyl Panel](https://pterodactyl.io/)
- Powered by [Modrinth API](https://docs.modrinth.com/)
- Powered by [CurseForge API](https://docs.curseforge.com/)

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on [GitHub](https://github.com/probablysubeditor69204/McTools/issues)
- Check the [INSTALL.md](INSTALL.md) for troubleshooting tips

## 🎉 Acknowledgments

Special thanks to the Pterodactyl community and all contributors who helped make this addon possible!

---

**Made with ❤️ for the Minecraft server community**
