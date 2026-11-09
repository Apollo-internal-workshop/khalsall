#!/bin/bash
# Builds the `supergraph` plugin and the router that understand @connect(mcp:),
# and installs them into this project's .rover/bin/ under the version that
# .rover/rover.yaml pins.
#
# Both are built from vendor/:
#   - vendor/router: router branch benjamn/connectors-mcp (committed, public)
#   - vendor/fedutils-build-plugins: branch benjamn/connectors-mcp-plugin of the
#     Apollo-internal mdg-private/fedutils-build-plugins. NOT committed here (this repo
#     is public); it is cloned on first run, which needs access to that private repo.
#     Its Cargo.toml path-patches apollo-federation to ../router, so the plugin composes
#     with the vendored router's apollo-federation
# Their target/ directories are git-ignored. A cold build takes a while,
# mostly the router.
#
# ROUTER_REPO or PLUGIN_REPO point at another checkout instead, for example a
# worktree you are editing. The plugin still links whatever apollo-federation
# its own Cargo.toml [patch] names.
#
# Needs rustup; the 1.99.1 toolchain is installed if missing. Rover 1.0 or later is needed to use what
# this installs: it refuses Federation 3 versions that sort below
# 3.0.0-preview, hence the `preview.` in the label.
#
# Usage: ./install-local-builds.sh [--no-build]
set -euo pipefail

HERE=$(cd "$(dirname "$0")" && pwd)
ROUTER_REPO=${ROUTER_REPO:-$HERE/vendor/router}
PLUGIN_REPO=${PLUGIN_REPO:-$HERE/vendor/fedutils-build-plugins}
VERSION=3.0.0-preview.connectors-mcp
BIN=$HERE/.rover/bin

if [[ "${1:-}" != "--no-build" ]]; then
  if [ ! -d "$PLUGIN_REPO" ]; then
    git clone --depth 1 --branch benjamn/connectors-mcp-plugin \
      git@github.com:mdg-private/fedutils-build-plugins.git "$PLUGIN_REPO"
    # The branch patches apollo-federation to a sibling checkout named router-connectors-mcp
    sed -i.bak 's#\.\./router-connectors-mcp/apollo-federation#../router/apollo-federation#' "$PLUGIN_REPO/Cargo.toml"
    rm -f "$PLUGIN_REPO/Cargo.toml.bak"
  fi
  rustup toolchain list | grep -q '^1\.99\.1' || rustup toolchain install 1.99.1 --profile minimal
  (cd "$PLUGIN_REPO" && rustup run 1.99.1 cargo build -p public --features rover --release)
  (cd "$ROUTER_REPO" && rustup run 1.99.1 cargo build -p apollo-router --bin router)
fi

mkdir -p "$BIN"
cp "$PLUGIN_REPO/target/release/fbp" "$BIN/supergraph-v$VERSION"
cp "$ROUTER_REPO/target/debug/router" "$BIN/router-v$VERSION"

echo "Installed into $BIN:"
echo "  supergraph-v$VERSION  (built in $PLUGIN_REPO)"
echo "  router-v$VERSION      (built in $ROUTER_REPO)"
