#!/bin/bash

# Git Worktree Management Script
# Usage: ./scripts/worktree.sh <command> [options]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
WORKTREE_ROOT="$REPO_ROOT/../worktrees"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_usage() {
    echo "Git Worktree Management Script"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  create <branch-name> [base-branch]  Create a new worktree"
    echo "  list                                List all worktrees"
    echo "  remove <branch-name>                Remove a worktree"
    echo "  clean                               Remove all worktrees"
    echo "  help                                Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 create feature/new-api main"
    echo "  $0 create hotfix/bug-fix"
    echo "  $0 list"
    echo "  $0 remove feature/new-api"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

ensure_worktree_root() {
    if [ ! -d "$WORKTREE_ROOT" ]; then
        log_info "Creating worktree directory: $WORKTREE_ROOT"
        mkdir -p "$WORKTREE_ROOT"
    fi
}

create_worktree() {
    local branch_name="$1"
    local base_branch="${2:-main}"
    
    if [ -z "$branch_name" ]; then
        log_error "Branch name is required"
        print_usage
        exit 1
    fi
    
    ensure_worktree_root
    
    local worktree_path="$WORKTREE_ROOT/$branch_name"
    
    # Check if worktree already exists
    if [ -d "$worktree_path" ]; then
        log_error "Worktree already exists: $worktree_path"
        exit 1
    fi
    
    # Check if branch exists locally
    if git show-ref --verify --quiet "refs/heads/$branch_name"; then
        log_info "Branch '$branch_name' exists locally, creating worktree..."
        git worktree add "$worktree_path" "$branch_name"
    # Check if branch exists on remote
    elif git show-ref --verify --quiet "refs/remotes/origin/$branch_name"; then
        log_info "Branch '$branch_name' exists on remote, creating worktree and tracking..."
        git worktree add --track -b "$branch_name" "$worktree_path" "origin/$branch_name"
    else
        log_info "Creating new branch '$branch_name' from '$base_branch'..."
        git worktree add -b "$branch_name" "$worktree_path" "$base_branch"
    fi
    
    log_success "Worktree created: $worktree_path"
    log_info "To start working: cd $worktree_path"
}

list_worktrees() {
    echo "Current worktrees:"
    git worktree list
}

remove_worktree() {
    local branch_name="$1"
    
    if [ -z "$branch_name" ]; then
        log_error "Branch name is required"
        print_usage
        exit 1
    fi
    
    local worktree_path="$WORKTREE_ROOT/$branch_name"
    
    if [ ! -d "$worktree_path" ]; then
        log_error "Worktree does not exist: $worktree_path"
        exit 1
    fi
    
    # Check if there are uncommitted changes
    if [ -n "$(cd "$worktree_path" && git status --porcelain)" ]; then
        log_warn "Worktree has uncommitted changes!"
        read -p "Do you want to continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Operation cancelled"
            exit 0
        fi
    fi
    
    log_info "Removing worktree: $worktree_path"
    git worktree remove "$worktree_path"
    
    # Ask if user wants to delete the branch
    read -p "Do you want to delete the branch '$branch_name'? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git branch -D "$branch_name" 2>/dev/null || log_warn "Could not delete branch '$branch_name'"
    fi
    
    log_success "Worktree removed successfully"
}

clean_worktrees() {
    log_warn "This will remove ALL worktrees!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Operation cancelled"
        exit 0
    fi
    
    # Get all worktree paths except the main one
    local worktrees=($(git worktree list --porcelain | grep '^worktree ' | awk '{print $2}' | grep -v "^$REPO_ROOT$"))
    
    for worktree in "${worktrees[@]}"; do
        log_info "Removing worktree: $worktree"
        git worktree remove "$worktree" --force
    done
    
    # Clean up prune
    git worktree prune
    
    log_success "All worktrees cleaned up"
}

# Change to repository root
cd "$REPO_ROOT"

# Parse command
case "${1:-help}" in
    "create")
        create_worktree "$2" "$3"
        ;;
    "list")
        list_worktrees
        ;;
    "remove")
        remove_worktree "$2"
        ;;
    "clean")
        clean_worktrees
        ;;
    "help"|*)
        print_usage
        ;;
esac