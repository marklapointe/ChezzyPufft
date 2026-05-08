# ChezzyPufft Makefile
#
# Cross-platform build system for Linux and FreeBSD
# Usage: make [target] [PLATFORM=<platform>]
#
# Supported platforms: linux, freebsd
# Default: auto-detect via uname

.PHONY: all build test lint check clean install uninstall help

# Platform detection
ifneq ($(PLATFORM),)
  DETECTED_PLATFORM := $(PLATFORM)
else
  DETECTED_PLATFORM := $(shell uname -s | tr '[:upper:]' '[:lower:]')
endif

# Normalize platform names
ifeq ($(findstring linux,$(DETECTED_PLATFORM)),linux)
  PLATFORM := linux
else ifeq ($(findstring freebsd,$(DETECTED_PLATFORM)),freebsd)
  PLATFORM := freebsd
else ifeq ($(findstring darwin,$(DETECTED_PLATFORM)),darwin)
  PLATFORM := macos
else
  $(error Unsupported platform: $(DETECTED_PLATFORM). Supported: linux, freebsd, macos)
endif

# Directories
PREFIX ?= /usr/local
ETCDIR ?= $(PREFIX)/etc/chezzypufft
BINDIR ?= $(PREFIX)/bin
DATADIR ?= $(PREFIX)/share/chezzypufft
SYSTEMDDIR ?= /lib/systemd/system

# Installation paths
SYSTEMD_SERVICE ?= $(SYSTEMDDIR)/emby-webui.service

# Include platform-specific variables
include Makefile.$(PLATFORM)

# Default target
all: build

## build - Build the application
build:
	@echo "Building ChezzyPufft for $(PLATFORM)..."
	@npm run build

## test - Run tests
test:
	@echo "Running tests..."
	@npm run test

## test:coverage - Run tests with coverage
test:coverage:
	@echo "Running tests with coverage..."
	@npm run test:coverage

## lint - Run linter
lint:
	@echo "Running linter..."
	@npm run lint

## check - TypeScript check
check:
	@echo "Running TypeScript check..."
	@npm run check

## clean - Clean build artifacts
clean:
	@echo "Cleaning..."
	@rm -rf dist
	@rm -rf coverage
	@npm run clean 2>/dev/null || true

## install - Install the application
install: install-deps install-webui install-service

## install-deps - Install dependencies
install-deps:
	@echo "Installing dependencies..."
	@npm install

## install-webui - Install webui files
install-webui: build
	@echo "Installing webui to $(DATADIR)..."
	@mkdir -p $(DATADIR)
	@mkdir -p $(ETCDIR)
	@cp -r dist/* $(DATADIR)/
	@cp config.example.json $(ETCDIR)/config.json 2>/dev/null || true

## install-service - Install service/daemon
install-service:
	@echo "Installing service for $(PLATFORM)..."
	@$(call install_service_impl)

## uninstall - Uninstall the application
uninstall: uninstall-service uninstall-webui

## uninstall-service - Uninstall service/daemon
uninstall-service:
	@$(call uninstall_service_impl)

## uninstall-webui - Uninstall webui files
uninstall-webui:
	@echo "Removing webui from $(DATADIR)..."
	@rm -rf $(DATADIR)
	@rm -rf $(ETCDIR)

## restart - Restart the service
restart:
	@$(call restart_service_impl)

## start - Start the service
start:
	@$(call start_service_impl)

## stop - Stop the service
stop:
	@$(call stop_service_impl)

## status - Check service status
status:
	@$(call status_service_impl)

## help - Show this help
help:
	@echo "ChezzyPufft Makefile"
	@echo ""
	@echo "Usage: make [target] [PLATFORM=<platform>]"
	@echo ""
	@echo "Targets:"
	@echo "  all              Build everything (default)"
	@echo "  build            Build the application"
	@echo "  test             Run tests"
	@echo "  test:coverage    Run tests with coverage"
	@echo "  lint             Run linter"
	@echo "  check            TypeScript check"
	@echo "  clean            Clean build artifacts"
	@echo "  install          Full installation (deps + webui + service)"
	@echo "  install-deps     Install npm dependencies"
	@echo "  install-webui    Install webui files"
	@echo "  install-service  Install system service"
	@echo "  uninstall        Full uninstall"
	@echo "  restart          Restart service"
	@echo "  start            Start service"
	@echo "  stop             Stop service"
	@echo "  status           Check service status"
	@echo "  help             Show this help"
	@echo ""
	@echo "Platforms: linux, freebsd, macos (auto-detected)"
	@echo "PLATFORM=<platform> to override auto-detection"
	@echo ""
	@echo "Current platform: $(PLATFORM)"
