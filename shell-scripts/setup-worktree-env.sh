#!/bin/bash

# Setup development environment for git worktrees
# This script configures shared settings and symlinks for consistent development experience

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

setup_git_config() {
    log_info "Setting up Git configuration for worktrees..."
    
    # Enable worktree support
    git config worktree.guessRemote true
    
    # Configure delta (if available) for better diff viewing
    if command -v delta &> /dev/null; then
        git config core.pager delta
        git config interactive.diffFilter "delta --color-only"
        git config delta.navigate true
        git config delta.light false
        git config merge.conflictstyle diff3
        git config diff.colorMoved default
    fi
    
    log_success "Git configuration updated"
}

setup_shared_configs() {
    log_info "Setting up shared configuration files..."
    
    # Create .editorconfig if it doesn't exist
    if [ ! -f "$REPO_ROOT/.editorconfig" ]; then
        cat > "$REPO_ROOT/.editorconfig" << 'EOF'
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.{js,jsx,ts,tsx,json,yaml,yml}]
indent_size = 2

[*.{go,py}]
indent_size = 4

[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab
EOF
        log_success "Created .editorconfig"
    fi
    
    # Update package.json scripts if it exists
    if [ -f "$REPO_ROOT/package.json" ]; then
        # Add worktree management scripts
        if ! grep -q "worktree:" "$REPO_ROOT/package.json"; then
            log_info "Consider adding these scripts to your package.json:"
            echo '  "scripts": {'
            echo '    "worktree:create": "./scripts/worktree.sh create",'
            echo '    "worktree:list": "./scripts/worktree.sh list",'
            echo '    "worktree:remove": "./scripts/worktree.sh remove",'
            echo '    "worktree:clean": "./scripts/worktree.sh clean"'
            echo '  }'
        fi
    fi
}

setup_vscode_settings() {
    log_info "Setting up VSCode workspace settings..."
    
    local vscode_dir="$REPO_ROOT/.vscode"
    mkdir -p "$vscode_dir"
    
    # Create workspace settings
    cat > "$vscode_dir/settings.json" << 'EOF'
{
  "files.exclude": {
    "**/node_modules": true,
    "**/target": true,
    "**/.git": true,
    "../worktrees": false
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/target": true,
    "../worktrees": false
  },
  "git.detectSubmodules": false,
  "git.scanRepositories": [
    "../worktrees"
  ],
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  }
}
EOF
    
    # Create extensions recommendations
    cat > "$vscode_dir/extensions.json" << 'EOF'
{
  "recommendations": [
    "ms-vscode.vscode-json",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "biomejs.biome",
    "golang.go",
    "rust-lang.rust-analyzer",
    "ms-python.python"
  ]
}
EOF
    
    log_success "VSCode settings configured"
}

create_worktree_alias() {
    log_info "Creating convenient aliases..."
    
    echo "Add these aliases to your shell profile (~/.bashrc, ~/.zshrc, etc.):"
    echo ""
    echo "# Git Worktree aliases"
    echo "alias wt='$REPO_ROOT/scripts/worktree.sh'"
    echo "alias wtc='$REPO_ROOT/scripts/worktree.sh create'"
    echo "alias wtl='$REPO_ROOT/scripts/worktree.sh list'"
    echo "alias wtr='$REPO_ROOT/scripts/worktree.sh remove'"
    echo ""
}

# Change to repository root
cd "$REPO_ROOT"

# Run setup functions
setup_git_config
setup_shared_configs
setup_vscode_settings
create_worktree_alias

log_success "Development environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Add the suggested aliases to your shell profile"
echo "2. Restart your IDE/editor to pick up new settings"
echo "3. Create your first worktree: ./scripts/worktree.sh create feature/my-feature"