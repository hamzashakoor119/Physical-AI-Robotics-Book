# Feature Specification: ROS 2 Fundamentals (Chapter 5)

**Feature Branch**: `005-ros2-fundamentals`
**Created**: 2025-12-07
**Status**: Draft
**Input**: Chapter 5: ROS 2 Fundamentals

## Meta Information

- **Title**: ROS 2 Fundamentals
- **Type**: Core Technical Chapter
- **Version**: 1.0
- **Difficulty**: Beginner → Intermediate
- **Dependencies**: Chapter 1: Introduction to Physical AI (required), Chapter 2: Sensors (required), Chapter 3: Actuators (required), Chapter 4: Control Systems (required)
- **Unlocks**: Digital Twin & Simulation, Advanced ROS 2 Topics, Complex Multi-Node Systems

## User Scenarios & Testing *(mandatory)*

This chapter serves learners who have completed Chapters 1-4 and have encountered ROS 2 in practical contexts (sensor nodes, actuator commands, ros2_control). This chapter consolidates that practical experience by formalizing ROS 2 architecture, core concepts, and development patterns, enabling learners to build more sophisticated robotic systems.

### User Story 1 - ROS 2 Core Concepts (Priority: P1)

A learner wants to understand what ROS 2 is, its architecture (nodes, topics, services, actions), and why it's the standard middleware for Physical AI systems.

**Why this priority**: Understanding ROS 2 architecture is fundamental for all subsequent robotics development. Without this foundation, learners cannot comprehend code examples in other chapters or build their own robotic systems.

**Independent Test**: Learner can explain ROS 2 architecture, identify communication patterns, and describe use cases for topics vs services vs actions. Can be tested via architecture diagrams and concept matching exercises.

**Acceptance Scenarios**:

1. **Given** ROS 2 architecture overview, **When** learner encounters a distributed robot system, **Then** they can identify nodes, topics, and communication flows in the system graph.
2. **Given** definitions of topics, services, and actions, **When** learner analyzes robot tasks (continuous sensor streaming, one-time configuration request, long-running motion command), **Then** they correctly select appropriate communication patterns.
3. **Given** comparison with ROS 1, **When** learner evaluates system requirements (real-time constraints, multi-robot systems), **Then** they understand why ROS 2 improvements (DDS middleware, QoS, security) are necessary.

---

### User Story 2 - ROS 2 Programming Basics (Priority: P2)

A learner wants to write basic ROS 2 nodes in Python and C++, publish/subscribe to topics, create services, and use command-line tools for debugging and visualization.

**Why this priority**: Practical programming skills enable hands-on development. Learners can now create nodes, exchange data, and debug robotic systems. Builds on P1 architectural understanding with concrete implementation.

**Independent Test**: Learner can write publisher/subscriber nodes, create custom messages, call services, and use ros2 CLI tools. Can be tested via coding exercises and debugging tasks.

**Acceptance Scenarios**:

1. **Given** ROS 2 development environment (Humble or Iron), **When** learner writes a Python publisher node, **Then** node publishes messages at specified rate and other nodes can subscribe to the topic.
2. **Given** custom message definitions (`.msg` files), **When** learner creates and builds custom message types, **Then** nodes can exchange structured data beyond standard types.
3. **Given** service-based communication requirements, **When** learner implements service server and client, **Then** client can request data/actions and receive synchronous responses.
4. **Given** ros2 CLI tools (ros2 topic, ros2 node, ros2 service), **When** learner debugs running system, **Then** they can inspect system state, visualize data, and troubleshoot issues.

---

### User Story 3 - ROS 2 Packages and Workspaces (Priority: P3)

A learner wants to organize code into ROS 2 packages, manage dependencies, build with colcon, and understand workspace overlays for development.

**Why this priority**: Package management and build system knowledge enables scalable development. Learners can now organize complex projects, reuse code, and collaborate. Depends on P1 and P2.

**Independent Test**: Learner can create ROS 2 packages with proper structure, define dependencies, build with colcon, and use workspace overlays. Can be tested via package creation and build exercises.

**Acceptance Scenarios**:

1. **Given** ROS 2 workspace structure, **When** learner creates a new package with `ros2 pkg create`, **Then** package has correct structure, dependencies are declared, and builds successfully.
2. **Given** multiple packages with dependencies, **When** learner builds workspace with colcon, **Then** build system resolves dependencies in correct order.
3. **Given** workspace overlay concept, **When** learner modifies existing ROS 2 packages, **Then** they understand how overlays enable development without modifying system installations.
4. **Given** launch files for multi-node systems, **When** learner creates launch configurations, **Then** they can start complex systems with proper parameter passing.

---

### Edge Cases

- **ROS 2 distribution differences**: Humble vs Iron vs Rolling - focus on concepts that transfer across distributions, note version-specific features when relevant.
- **Operating system variations**: Ubuntu native vs WSL2 on Windows vs Docker - provide installation guidance for common platforms, emphasize Ubuntu native for best experience.
- **Programming language choice**: Python vs C++ - provide examples in both languages for core concepts, note when language choice matters (performance-critical nodes).
- **Hardware access**: Some learners may not have robots - emphasize simulation (Gazebo, Isaac Sim) and visualization tools (RViz, rqt) for learning without physical hardware.

## Requirements *(mandatory)*

### Functional Requirements

#### Content Requirements

- **FR-001**: Chapter MUST define ROS 2 clearly ("Robot Operating System 2, a middleware framework for distributed robot software development").
- **FR-002**: Chapter MUST explain ROS 2 architecture with at least 5 core concepts:
  - Nodes (computational processes, basic building blocks)
  - Topics (publish-subscribe, asynchronous, many-to-many)
  - Services (request-response, synchronous, one-to-one)
  - Actions (long-running tasks with feedback, goal-based)
  - Parameters (configuration values, dynamic reconfiguration)
- **FR-003**: Chapter MUST cover ROS 2 communication patterns and when to use each:
  - Topics for continuous data streams (sensor data, state updates)
  - Services for one-time requests (configuration, computation)
  - Actions for long-running commands (navigation, manipulation)
- **FR-004**: Chapter MUST explain ROS 2 vs ROS 1 improvements:
  - DDS (Data Distribution Service) middleware for real-time, QoS
  - Multi-platform support (Linux, Windows, macOS)
  - Security features (authentication, encryption)
  - Better lifecycle management and deterministic behavior
- **FR-005**: Chapter MUST cover ROS 2 workspace structure:
  - Workspace anatomy (src/, build/, install/, log/)
  - Package structure (package.xml, CMakeLists.txt/setup.py, launch/, config/)
  - Workspace overlays (underlay/overlay concept)
- **FR-006**: Chapter MUST explain colcon build system:
  - Building packages (`colcon build`)
  - Sourcing workspace (`source install/setup.bash`)
  - Selective builds (`colcon build --packages-select`)
  - Dependency resolution
- **FR-007**: Chapter MUST cover ROS 2 command-line tools:
  - `ros2 topic` (list, echo, info, pub)
  - `ros2 node` (list, info)
  - `ros2 service` (list, call, type)
  - `ros2 param` (list, get, set)
  - `ros2 launch` (starting systems)
- **FR-008**: Chapter MUST include diagrams for:
  - ROS 2 architecture (nodes, topics, services, actions in a system graph)
  - Topic publish-subscribe pattern
  - Service request-response pattern
  - Action goal-feedback-result pattern
  - Workspace structure and overlay concept

#### Code Requirements

- **FR-009**: Chapter MUST include at least 6 ROS 2 code examples:
  - (1) Simple publisher node (Python)
  - (2) Simple subscriber node (Python)
  - (3) Publisher + subscriber in C++ (demonstrate both languages)
  - (4) Service server and client (request-response)
  - (5) Action server basics (long-running task)
  - (6) Launch file for multi-node system
- **FR-010**: ROS 2 code examples MUST use ROS 2 Humble or Iron with version specified and message types from standard packages (`std_msgs`, `sensor_msgs`, `geometry_msgs`, `example_interfaces`).
- **FR-011**: Chapter MUST provide code for creating custom messages and services (`.msg` and `.srv` file definitions, CMake/setup.py configuration).
- **FR-012**: Chapter MUST include examples of parameter handling (declaring, getting, setting parameters in nodes).

#### Simulation and Visualization Requirements

- **FR-013**: Chapter MUST introduce RViz for visualization:
  - Launching RViz with configurations
  - Visualizing topics (TF frames, markers, robot models)
  - Creating and saving RViz configurations
- **FR-014**: Chapter MUST introduce rqt tools for debugging and monitoring:
  - rqt_graph (visualizing node/topic connections)
  - rqt_plot (plotting numeric data)
  - rqt_console (viewing log messages)
  - rqt_reconfigure (dynamic parameter adjustment)
- **FR-015**: Chapter MUST provide examples of integrating with Gazebo or Isaac Sim (demonstrating ROS 2 nodes communicating with simulation environments).
- **FR-016**: Chapter MUST explain TF (transform) system basics:
  - Coordinate frames and transformations
  - Publishing static and dynamic transforms
  - Listening to transforms in nodes
  - Visualizing TF trees

#### Interactive Elements

- **FR-017**: Chapter MUST include a glossary defining at minimum: ROS 2, Node, Topic, Service, Action, Message, Publisher, Subscriber, Parameter, DDS, QoS, Workspace, Package, Colcon, Launch File, RViz, TF.
- **FR-018**: Chapter MUST include review questions covering conceptual, technical, and practical learning objectives (minimum 15 questions).
- **FR-019**: Review questions MUST test: ROS 2 architecture, communication pattern selection, code comprehension, CLI tool usage, debugging strategies, package management.

### Key Entities

- **Node**: Computational process in ROS 2 graph (attributes: name, namespace, publishers, subscribers, services, actions, parameters)
- **Topic**: Named bus for asynchronous message passing (attributes: name, message type, QoS profile, publishers, subscribers)
- **Service**: Synchronous request-response communication (attributes: service name, service type, server node, client nodes)
- **Action**: Goal-oriented task with feedback (attributes: action name, action type, goal, feedback, result, server, clients)
- **Message**: Structured data type (attributes: package, name, fields with types)
- **Package**: Organizational unit for ROS 2 code (attributes: name, version, dependencies, build system, entry points)
- **Workspace**: Collection of packages (attributes: source space, build artifacts, install space, log files)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Learners can correctly identify ROS 2 communication patterns (topics, services, actions) for 8 out of 10 robot task scenarios with justification.
- **SC-002**: Learners can explain ROS 2 architecture components (nodes, topics, DDS middleware) with 80% accuracy.
- **SC-003**: Learners with Python experience can write and run a publisher-subscriber pair within 30 minutes.
- **SC-004**: Learners can create a ROS 2 package with proper structure, dependencies, and build configuration.
- **SC-005**: Learners can use ros2 CLI tools to inspect running systems (list nodes/topics, echo messages, call services) and debug common issues.
- **SC-006**: Learners can create custom message types, build packages, and use custom messages in nodes.
- **SC-007**: Learners can implement a service server and client for a specific task (e.g., configuration request, computation service).
- **SC-008**: Learners can create launch files to start multi-node systems with proper parameter passing.
- **SC-009**: Chapter review questions achieve 75% average correctness rate among learners with basic programming background.
- **SC-010**: Learners can visualize ROS 2 systems using RViz and rqt tools to understand system state and data flow.
- **SC-011**: Learners can explain when to use topics vs services vs actions and provide 3 examples of each use case.
- **SC-012**: Advanced learners report sufficient depth on ROS 2 concepts for building real robotic systems (satisfaction target: 75% positive).

## Assumptions

1. **Prerequisite Knowledge**: Assume learners have completed Chapters 1-4 and have basic programming literacy (variables, functions, loops, conditionals in any language). Learners have already written simple ROS 2 nodes in previous chapters but may not fully understand underlying architecture.

2. **Technical Environment**: Assume learners have:
   - Ubuntu 22.04 LTS (native or WSL2 on Windows)
   - ROS 2 Humble LTS installed via apt packages
   - Development tools (Python 3, C++ compiler, colcon, Git) already configured from previous chapters
   - Gazebo and/or Isaac Sim for simulation integration examples (used in Chapters 2-4)

3. **Learning Context**: This chapter consolidates and formalizes ROS 2 knowledge after learners have practical exposure in Chapters 2-4. Learners have seen ROS 2 topics, nodes, and messages in action but now gain systematic understanding of architecture, design patterns, and advanced tooling. This enables them to build more complex systems in subsequent chapters.

4. **ROS 2 Distribution Focus**: All content focuses exclusively on ROS 2 Humble LTS (long-term support until May 2027, stable production release). Installation instructions, code examples, and package versions all target Humble. This ensures consistency with Chapters 2-4 and provides stable foundation for learners.

5. **Programming Language Balance**: Provide examples in both Python (easier for beginners, rapid prototyping) and C++ (performance-critical, industry standard). Emphasize that concepts transfer across languages.

6. **Hardware Requirements**: No physical robot required. All concepts can be learned with simulation and visualization tools. Physical hardware examples (sensors, actuators) referenced from Chapters 2-3 to demonstrate how ROS 2 concepts apply to real systems learners have already encountered.

7. **Code Examples**: All ROS 2 code examples tested and verified with specified versions. Code must be copy-pastable and runnable with minimal configuration (assumes ROS 2 installation complete).

8. **Depth vs Breadth**: Balance broad coverage of core concepts (nodes, topics, services, actions, packages, tools) with sufficient depth for practical usage. Advanced topics (lifecycle nodes, components, composition, security, QoS tuning) mentioned but deferred to advanced chapters.

## Cross-Chapter Dependencies

**Builds on**:
- **Chapter 1: Introduction to Physical AI** - Perception-action loop, distributed systems, real-time AI concepts (required prerequisite)
- **Chapter 2: Sensors** - Practical ROS 2 topics, sensor_msgs, subscribers (required prerequisite - learners have written sensor nodes)
- **Chapter 3: Actuators** - ROS 2 publishers, control_msgs, trajectory messages, ros2_control basics (required prerequisite - learners have written actuator commands)
- **Chapter 4: Control Systems** - ROS 2 control framework, PID nodes, parameters (required prerequisite - learners have configured ros2_control)

**Prepares for**:
- **Chapter 6: Digital Twin & Simulation** - Advanced ROS 2 simulation integration, custom Gazebo/Isaac Sim plugins, distributed simulation
- **Chapter N: Advanced ROS 2 Topics** - Lifecycle nodes, component composition, real-time executors, security (SROS2), multi-robot systems
- **Chapter N: Humanoid Control** - Complex multi-node systems, coordinated action servers, TF trees for full-body kinematics
- **Chapter N: Manipulation** - Action-based manipulation, MoveIt integration, planning with ROS 2
- **Chapter N: Autonomous Navigation** - Nav2 stack, behavior trees, complex launch configurations

This chapter consolidates practical ROS 2 experience from Chapters 2-4 and provides systematic architecture knowledge needed for advanced topics in subsequent chapters.

## Learning Objectives

### Conceptual (Must Understand)

1. Define ROS 2 and its role in distributed robot software development
2. Explain ROS 2 architecture: nodes, topics, services, actions, parameters
3. Understand differences between ROS 1 and ROS 2 (DDS middleware, QoS, security)
4. Distinguish between topics (asynchronous, many-to-many), services (synchronous, one-to-one), and actions (goal-based, feedback)
5. Understand ROS 2 workspace structure and overlay concept
6. Explain the role of colcon build system in package management

### Technical (Must Be Able to Explain)

1. Describe publisher-subscriber pattern and when to use topics
2. Explain service request-response pattern and use cases
3. Describe action goal-feedback-result pattern for long-running tasks
4. Explain message types and how to create custom messages
5. Describe package structure (package.xml, CMakeLists.txt, setup.py)
6. Explain parameter system for runtime configuration
7. Describe TF (transform) system for coordinate frames
8. Explain QoS (Quality of Service) policies and their impact

### Practical (Must Be Able to Do)

1. Install and configure ROS 2 development environment
2. Write publisher and subscriber nodes in Python and C++
3. Create and call services (server and client implementation)
4. Create custom message and service definitions
5. Build ROS 2 packages with colcon and manage dependencies
6. Use ros2 CLI tools to inspect and debug running systems
7. Create launch files for multi-node systems with parameter passing
8. Visualize ROS 2 systems with RViz and rqt tools
9. Work with workspace overlays for development
10. Integrate ROS 2 nodes with simulation environments (Gazebo, Isaac Sim)

## Knowledge Graph Structure

```
ROS 2 (Robot Operating System 2)
│
├── Architecture & Core Concepts
│   ├── Nodes (computational processes)
│   ├── Topics (publish-subscribe communication)
│   ├── Services (request-response communication)
│   ├── Actions (long-running tasks with feedback)
│   └── Parameters (runtime configuration)
│
├── Workspace & Build System
│   ├── Workspace Structure (src/, build/, install/, log/)
│   ├── Packages (package.xml, CMakeLists.txt/setup.py)
│   ├── Colcon Build System
│   └── Workspace Overlays (underlay/overlay)
│
├── Communication Middleware
│   ├── DDS (Data Distribution Service)
│   ├── QoS Policies (reliability, durability, history)
│   └── ROS 1 vs ROS 2 (architecture, performance, security)
│
├── Development Tools & CLI
│   ├── ros2 CLI Tools (topic, node, service, param, launch)
│   ├── Launch System (Python launch files)
│   ├── Visualization Tools (RViz, rqt)
│   └── Debugging Tools (ros2 bag, ros2 doctor)
│
├── Message System
│   ├── Standard Message Types (std_msgs, sensor_msgs, geometry_msgs)
│   ├── Custom Messages (.msg files)
│   └── Message Serialization (CDR)
│
└── Advanced Topics (Overview)
    ├── TF2 (Transform System)
    ├── Lifecycle Nodes
    ├── Component Composition
    ├── Security (SROS2)
    └── Multi-Robot Systems
```

## Prerequisites

| Concept                              | Required Level  | Notes                                                                 |
|--------------------------------------|-----------------|-----------------------------------------------------------------------|
| Programming (Python or C++)          | Required        | Basic programming literacy (variables, functions, loops, conditionals) - learners have this from Chapters 2-4 |
| Linux Command Line                   | Required        | Basic shell commands, environment sourcing - used in Chapters 2-4      |
| Chapter 1: Introduction to Physical AI | Required        | Perception-action loop, distributed systems concepts                  |
| Chapter 2: Sensors                   | Required        | Practical ROS 2 topic usage, sensor nodes, subscribers                |
| Chapter 3: Actuators                 | Required        | ROS 2 publishers, actuator commands, ros2_control basics              |
| Chapter 4: Control Systems           | Required        | ROS 2 control framework, PID nodes, parameter configuration           |
| Version Control (Git)                | Recommended     | Helpful for managing code, used in previous chapters                  |

## Notes

- This specification is technology-agnostic where possible (focuses on ROS 2 concepts, not specific robot platforms).
- ROS 2 Humble LTS is the exclusive target version (long-term support until May 2027, stable production release). All code examples, installation instructions, and package versions target Humble specifically.
- Chapter structure follows constitutional principle II (Structure First): theory → diagrams → code → visualization → glossary → review questions.
- All technical claims will be verified against official ROS 2 Humble documentation during content creation per constitutional principle I (Accuracy First).
- Balance between Python (accessibility, used in Chapters 2-4) and C++ (performance, industry adoption) in code examples.
- Simulation integration examples use Gazebo Fortress/Garden and Isaac Sim, consistent with Chapters 2-4.
- Advanced topics (lifecycle, components, security, real-time) introduced conceptually, deferred to advanced chapters for detailed coverage.
- This chapter consolidates ROS 2 knowledge from Chapters 2-4, providing systematic architecture understanding after practical exposure. Learners transition from "using ROS 2" to "understanding ROS 2 deeply".
