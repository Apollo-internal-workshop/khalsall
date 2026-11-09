<p align="center">
  <img src="https://avatars.githubusercontent.com/u/17189275?s=200&v=4" alt="Logo" width="150" height="150" />
</p>

# Apollo GraphQL Enterprise GraphOS Workshop 

<p align="center">
  <b>A comprehensive hands-on workshop covering GraphOS enterprise capabilities</b></br>
  <sub>This workshop is intended for an audience looking to learn how graph implementations are scaled across multiple teams and complex development environments leveraging Apollo GraphOS enterprise, router, and federation.</sub>
</p>

<br>

<table>
    <tbody>
        <tr>
            <td>
                <b><sub>🚀 Interested in an Apollonaut hosting this workshop at your organization?<sub></b>
            </td>
        </tr>
        <tr>
            <td>
                <sub>We run this workshop across large audiences and organizations and find that more than <b>90%</b> of participants complete the workshop with <i>little to no prior</i> GraphQL experience, and leave with a greater understanding of GraphQL and the value it brings to their teams.</br></br> <b>Schedule a workshop by contacting your Apollo GraphQL account team. </b></sub>
            </td>
        </tr>
    </tbody>
</table>
<br>
<hr>

#### ➤ Objectives
In this workshop you will learn how to:
- Secure your supergraph
- Support real-time use cases with federated subscriptions
- Extend your supergraph with coprocessors
- Incrementally transfer ownerhsip of fields

Afterwards, you'll be able to answer:
- How your organization can leverage GraphOS enterprise capabilities


#### ➤ Features 
This workshop covers the following:

##### Security
- Authentication
- Authorization
- Coprocessors
- Operation Limits
- Operation Safelisting

##### Schema Collaboration and Development
- Schema Update and Proposals
- Progressive Overrides

##### Performance
- Persisted Queries
- Federated Subscriptions
- *Demand Control*
- *Entity Caching*


## ➤ Maintainers
This workshop is maintained by the following core individuals:

- **Keith Halsall** - [@ausimity](https://github.com/ausimity])
- **Brandon Him** - [@brh55](https://github.com/brh55)
- **Tobi Abedisi** - [@tobi-adebisi](https://github.com/tobi-adebisi)
- **Michael Berger** - [@berger-michael](https://github.com/berger-michael)
- **Jesse Lovelace** - [@mentat](https://github.com/mentat)


## ☀︎ GraphQL Summit
<br>
<div align="center">
<img src="https://summit.graphql.com/_next/static/media/logo-summit-by-apollo.0b868952.svg" width="120"/>
<h4>The conference for
API platform builders and leaders</h4>

Join us in person and participate in **this** workshop by registering to attend [GraphQL Summit](https://summit.graphql.com/). 

</div>


## Tickets MCP server

`tickets-schema.graphql` is a connector subgraph over the mock ticketing MCP server in `tickets-mcp/`.
It uses connect/v0.5 (preview), as does `orders-schema.graphql`, so the router and the composition plugin have to be
the builds that understand `@connect(mcp:)`. The router is vendored under `vendor/router`. The composition plugin comes from the Apollo-internal `mdg-private/fedutils-build-plugins`, so it is not committed (this repo is public): `install-local-builds.sh` clones it into the git-ignored `vendor/fedutils-build-plugins/` and needs access to that repo.

**Composition is local.** GraphOS can't compose `mcp:` yet, so the router runs on a locally composed supergraph, and Studio
gets a plain-federation view of Tickets instead (`tickets-studio-schema.graphql`, no `@connect`; keep it in sync with
`tickets-schema.graphql`). Regenerate the committed `supergraph.graphql` whenever a subgraph schema changes:

```sh
./install-local-builds.sh --no-build   # after the first build
.rover/bin/rover supergraph compose --config supergraph-config.yaml --elv2-license accept --output supergraph.graphql
```

**Router image.** Built once and shared; deploys only reference `gcr.io/summit-enterprise-workshop/router-mcp:latest`.
The supergraph and `router.yaml` are mounted from Secret Manager at deploy time. Rebuild only when `vendor/router` changes:

```sh
gcloud builds submit . --project summit-enterprise-workshop --config router/cloudbuild-mcp.yaml
```

**Deploy** with the `Deploy Tickets MCP + Router` workflow (Tickets service first, then the router).
