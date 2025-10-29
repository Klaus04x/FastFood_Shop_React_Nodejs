/* Cross-platform port killer for npm scripts */
const kill = require('kill-port');

const args = process.argv.slice(2);
const ports = args.map((p) => Number(p)).filter((p) => Number.isInteger(p) && p > 0);

if (ports.length === 0) {
  process.exit(0);
}

Promise.all(
  ports.map((port) =>
    kill(port).catch(() => {
      /* ignore if not in use */
    })
  )
)
  .then(() => process.exit(0))
  .catch(() => process.exit(0));


