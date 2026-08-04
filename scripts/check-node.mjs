const requiredMajor = 24;
const currentMajor = Number(process.versions.node.split(".")[0]);

if (currentMajor < requiredMajor) {
  console.error(
    `Media Detective requires Node.js >= ${requiredMajor}. Current version: ${process.versions.node}. Run \"nvm use\" and try again.`,
  );
  process.exit(1);
}
