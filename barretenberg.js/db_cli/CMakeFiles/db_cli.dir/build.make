# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.16

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:


#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:


# Remove some rules from gmake that .SUFFIXES does not remove.
SUFFIXES =

.SUFFIXES: .hpux_make_needs_suffix_list


# Suppress display of executed commands.
$(VERBOSE).SILENT:


# A target that is always out of date.
cmake_force:

.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /usr/bin/cmake

# The command to remove a file.
RM = /usr/bin/cmake -E remove -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /mnt/user-data/joe/aztec2-internal/barretenberg

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /mnt/user-data/joe/aztec2-internal/barretenberg/build

# Include any dependencies generated for this target.
include src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/depend.make

# Include the progress variables for this target.
include src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/progress.make

# Include the compile flags for this target's objects.
include src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/flags.make

src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/cmake_pch.hxx.pch: src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/flags.make
src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/cmake_pch.hxx.pch: src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/cmake_pch.hxx.cxx
src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/cmake_pch.hxx.pch: src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/cmake_pch.hxx
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/mnt/user-data/joe/aztec2-internal/barretenberg/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/cmake_pch.hxx.pch"
	cd /mnt/user-data/joe/aztec2-internal/barretenberg/build/src/aztec/rollup/db_cli && /usr/bin/clang++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -Xclang -emit-pch -Xclang -include -Xclang /mnt/user-data/joe/aztec2-internal/barretenberg/build/src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/cmake_pch.hxx -o CMakeFiles/db_cli.dir/cmake_pch.hxx.pch -c /mnt/user-data/joe/aztec2-internal/barretenberg/build/src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/cmake_pch.hxx.cxx

src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/cmake_pch.hxx.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/db_cli.dir/cmake_pch.hxx.i"
	cd /mnt/user-data/joe/aztec2-internal/barretenberg/build/src/aztec/rollup/db_cli && /usr/bin/clang++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -Xclang -emit-pch -Xclang -include -Xclang /mnt/user-data/joe/aztec2-internal/barretenberg/build/src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/cmake_pch.hxx -E /mnt/user-data/joe/aztec2-internal/barretenberg/build/src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/cmake_pch.hxx.cxx > CMakeFiles/db_cli.dir/cmake_pch.hxx.i

src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/cmake_pch.hxx.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/db_cli.dir/cmake_pch.hxx.s"
	cd /mnt/user-data/joe/aztec2-internal/barretenberg/build/src/aztec/rollup/db_cli && /usr/bin/clang++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -Xclang -emit-pch -Xclang -include -Xclang /mnt/user-data/joe/aztec2-internal/barretenberg/build/src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/cmake_pch.hxx -S /mnt/user-data/joe/aztec2-internal/barretenberg/build/src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/cmake_pch.hxx.cxx -o CMakeFiles/db_cli.dir/cmake_pch.hxx.s

src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/main.cpp.o: src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/flags.make
src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/main.cpp.o: ../src/aztec/rollup/db_cli/main.cpp
src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/main.cpp.o: src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/cmake_pch.hxx
src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/main.cpp.o: src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/cmake_pch.hxx.pch
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/mnt/user-data/joe/aztec2-internal/barretenberg/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building CXX object src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/main.cpp.o"
	cd /mnt/user-data/joe/aztec2-internal/barretenberg/build/src/aztec/rollup/db_cli && /usr/bin/clang++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -Xclang -include-pch -Xclang /mnt/user-data/joe/aztec2-internal/barretenberg/build/src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/cmake_pch.hxx.pch -o CMakeFiles/db_cli.dir/main.cpp.o -c /mnt/user-data/joe/aztec2-internal/barretenberg/src/aztec/rollup/db_cli/main.cpp

src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/main.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/db_cli.dir/main.cpp.i"
	cd /mnt/user-data/joe/aztec2-internal/barretenberg/build/src/aztec/rollup/db_cli && /usr/bin/clang++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -Xclang -include-pch -Xclang /mnt/user-data/joe/aztec2-internal/barretenberg/build/src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/cmake_pch.hxx.pch -E /mnt/user-data/joe/aztec2-internal/barretenberg/src/aztec/rollup/db_cli/main.cpp > CMakeFiles/db_cli.dir/main.cpp.i

src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/main.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/db_cli.dir/main.cpp.s"
	cd /mnt/user-data/joe/aztec2-internal/barretenberg/build/src/aztec/rollup/db_cli && /usr/bin/clang++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -Xclang -include-pch -Xclang /mnt/user-data/joe/aztec2-internal/barretenberg/build/src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/cmake_pch.hxx.pch -S /mnt/user-data/joe/aztec2-internal/barretenberg/src/aztec/rollup/db_cli/main.cpp -o CMakeFiles/db_cli.dir/main.cpp.s

# Object files for target db_cli
db_cli_OBJECTS = \
"CMakeFiles/db_cli.dir/main.cpp.o"

# External object files for target db_cli
db_cli_EXTERNAL_OBJECTS =

src/aztec/rollup/db_cli/db_cli: src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/cmake_pch.hxx.pch
src/aztec/rollup/db_cli/db_cli: src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/main.cpp.o
src/aztec/rollup/db_cli/db_cli: src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/build.make
src/aztec/rollup/db_cli/db_cli: _deps/leveldb-build/libleveldb.a
src/aztec/rollup/db_cli/db_cli: src/aztec/stdlib/merkle_tree/libstdlib_merkle_tree.a
src/aztec/rollup/db_cli/db_cli: src/aztec/env/libenv.a
src/aztec/rollup/db_cli/db_cli: _deps/leveldb-build/libleveldb.a
src/aztec/rollup/db_cli/db_cli: src/aztec/stdlib/hash/blake2s/libstdlib_blake2s.a
src/aztec/rollup/db_cli/db_cli: src/aztec/stdlib/hash/pedersen/libstdlib_pedersen.a
src/aztec/rollup/db_cli/db_cli: src/aztec/stdlib/primitives/libstdlib_primitives.a
src/aztec/rollup/db_cli/db_cli: src/aztec/plonk/composer/libcomposer.a
src/aztec/rollup/db_cli/db_cli: src/aztec/plonk/proof_system/libproof_system.a
src/aztec/rollup/db_cli/db_cli: src/aztec/plonk/transcript/libtranscript.a
src/aztec/rollup/db_cli/db_cli: src/aztec/crypto/blake2s/libblake2s.a
src/aztec/rollup/db_cli/db_cli: src/aztec/plonk/reference_string/libreference_string.a
src/aztec/rollup/db_cli/db_cli: src/aztec/crypto/pedersen/libpedersen.a
src/aztec/rollup/db_cli/db_cli: src/aztec/ecc/libecc.a
src/aztec/rollup/db_cli/db_cli: src/aztec/polynomials/libpolynomials.a
src/aztec/rollup/db_cli/db_cli: src/aztec/srs/libsrs.a
src/aztec/rollup/db_cli/db_cli: src/aztec/ecc/libecc.a
src/aztec/rollup/db_cli/db_cli: src/aztec/polynomials/libpolynomials.a
src/aztec/rollup/db_cli/db_cli: src/aztec/srs/libsrs.a
src/aztec/rollup/db_cli/db_cli: src/aztec/crypto/keccak/libkeccak.a
src/aztec/rollup/db_cli/db_cli: src/aztec/numeric/libnumeric.a
src/aztec/rollup/db_cli/db_cli: src/aztec/env/libenv.a
src/aztec/rollup/db_cli/db_cli: /usr/lib/llvm-10/lib/libomp.so
src/aztec/rollup/db_cli/db_cli: /usr/lib/x86_64-linux-gnu/libpthread.so
src/aztec/rollup/db_cli/db_cli: src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --bold --progress-dir=/mnt/user-data/joe/aztec2-internal/barretenberg/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Linking CXX executable db_cli"
	cd /mnt/user-data/joe/aztec2-internal/barretenberg/build/src/aztec/rollup/db_cli && $(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/db_cli.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/build: src/aztec/rollup/db_cli/db_cli

.PHONY : src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/build

src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/clean:
	cd /mnt/user-data/joe/aztec2-internal/barretenberg/build/src/aztec/rollup/db_cli && $(CMAKE_COMMAND) -P CMakeFiles/db_cli.dir/cmake_clean.cmake
.PHONY : src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/clean

src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/depend:
	cd /mnt/user-data/joe/aztec2-internal/barretenberg/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /mnt/user-data/joe/aztec2-internal/barretenberg /mnt/user-data/joe/aztec2-internal/barretenberg/src/aztec/rollup/db_cli /mnt/user-data/joe/aztec2-internal/barretenberg/build /mnt/user-data/joe/aztec2-internal/barretenberg/build/src/aztec/rollup/db_cli /mnt/user-data/joe/aztec2-internal/barretenberg/build/src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : src/aztec/rollup/db_cli/CMakeFiles/db_cli.dir/depend
