![Logo](logo.png)
# Unofficial FDA API MCP Server

A comprehensive Model Context Protocol (MCP) server that provides access to the U.S. Food and Drug Administration's public datasets through the openFDA API. This server enables querying of drug adverse events, product labeling, recalls, approvals, shortages, NDC directory information, and medical device regulatory data including 510(k) clearances, classifications, and adverse events.

**Developed by [Augmented Nature](https://augmentednature.ai)**

## Features

### Drug Tools (6 tools implemented)
- **search_drug_adverse_events**: Search FDA Adverse Event Reporting System (FAERS) data
- **search_drug_labels**: Search drug product labeling information
- **search_drug_ndc**: Query the National Drug Code (NDC) directory
- **search_drug_recalls**: Find drug recall enforcement reports
- **search_drugs_fda**: Search the Drugs@FDA database for approved products
- **search_drug_shortages**: Query current drug shortages

### Device Tools (4 tools implemented)
- **search_device_510k**: Search FDA 510(k) device clearances
- **search_device_classifications**: Search FDA device classifications  
- **search_device_adverse_events**: Search FDA device adverse events (MDR)
- **search_device_recalls**: Search FDA device recall enforcement reports

### Key Features
- **Comprehensive Search**: Advanced filtering by drug name, manufacturer, indication, dates, and more
- **Rate Limiting**: Built-in awareness of FDA API rate limits (1,000 requests/hour without API key)
- **Error Handling**: Robust error handling with meaningful error messages
- **Formatted Results**: Clean, structured JSON responses with relevant metadata
- **Optional API Key**: Supports FDA API key for higher rate limits (120,000 requests/hour)

## Installation

1. The server is already built and configured in your MCP settings
2. Optionally set an FDA API key for higher rate limits:

```bash
# Set FDA_API_KEY environment variable for higher rate limits
export FDA_API_KEY="your_api_key_here"
```

To get an FDA API key:
1. Visit [https://open.fda.gov/apis/authentication/](https://open.fda.gov/apis/authentication/)
2. Sign up for an API key
3. Add it to your MCP settings or environment

## Usage Examples

### Search Drug Adverse Events
```
Search for adverse events related to aspirin that occurred in the United States in 2023
```

### Search Drug Labels
```
Find labeling information for diabetes medications manufactured by Novo Nordisk
```

### Search NDC Directory
```
Look up NDC information for ibuprofen tablets
```

### Search Drug Recalls
```
Find all Class I drug recalls from 2023 involving contamination
```

### Search FDA Approved Drugs
```
Find all FDA-approved drugs sponsored by Pfizer with injection dosage form
```

### Search Drug Shortages
```
Find current drug shortages for antibiotics
```

## API Response Format

All tools return structured JSON with:
- `search_criteria`: The parameters used for the search
- `total_results`: Total number of matching records in FDA database
- `results_shown`: Number of results returned in this response
- `[data_type]`: Array of formatted results (e.g., `adverse_events`, `drug_labels`)
- `api_usage`: Information about API key status and rate limits

## Rate Limiting

- **Without API Key**: 1,000 requests per hour
- **With API Key**: 120,000 requests per hour
- The server automatically handles rate limit errors and provides helpful messages

## Architecture

The server is built with a modular architecture:

- **`/src/index.ts`**: Main server setup and tool registration
- **`/src/handlers/drug-handlers.ts`**: All drug-related tool implementations
- **`/src/handlers/device-handlers.ts`**: All device-related tool implementations
- **`/src/utils/api-client.ts`**: HTTP client with error handling and rate limiting
- **`/src/types/fda.ts`**: TypeScript interfaces for all FDA data structures

## Supported Search Parameters

### Drug Adverse Events
- `drug_name`: Name of the drug or medication
- `brand_name`: Brand/trade name
- `generic_name`: Generic name
- `manufacturer`: Manufacturer name
- `reaction`: Adverse reaction or side effect
- `serious_only`: Only return serious adverse events
- `patient_sex`: Patient sex (1=Male, 2=Female)
- `country`: Country where event occurred
- `date_from`/`date_to`: Date range filters
- `count`: Group results for counting
- `limit`: Maximum results (1-100)
- `skip`: Pagination offset

### Drug Labels
- `brand_name`: Brand/trade name of the drug
- `generic_name`: Generic name
- `manufacturer`: Manufacturer name
- `active_ingredient`: Active ingredient name
- `indication`: Medical indication or condition
- `route`: Route of administration
- `product_type`: Product type
- Plus standard pagination and counting parameters

### NDC Directory
- `product_ndc`: Product NDC number
- `package_ndc`: Package NDC number
- `proprietary_name`: Brand name
- `nonproprietary_name`: Generic name
- `labeler_name`: Manufacturer/labeler name
- `dosage_form`: Dosage form (tablet, capsule, etc.)
- `route`: Route of administration
- `substance_name`: Active substance name
- Plus standard pagination and counting parameters

### Drug Recalls
- `product_description`: Product description
- `recalling_firm`: Name of recalling firm
- `classification`: Recall classification (Class I, II, III)
- `status`: Recall status
- `state`/`country`: Geographic filters
- `reason_for_recall`: Reason for recall
- `date_from`/`date_to`: Date range filters
- Plus standard pagination and counting parameters

### Drugs@FDA
- `sponsor_name`: Sponsor/applicant name
- `application_number`: FDA application number
- `brand_name`: Brand/trade name
- `generic_name`: Generic name
- `active_ingredient`: Active ingredient
- `dosage_form`: Dosage form
- `marketing_status`: Marketing status
- Plus standard pagination and counting parameters

### Drug Shortages
- `product_name`: Product name
- `generic_name`: Generic name
- `brand_name`: Brand name
- `active_ingredient`: Active ingredient
- `shortage_status`: Current shortage status
- `shortage_designation`: Shortage designation (Yes/No)
- `dosage_form`: Dosage form
- Plus standard pagination and counting parameters

### Device 510(k) Clearances
- `device_name`: Name of the medical device
- `applicant`: Applicant company name
- `contact`: Contact information
- `product_code`: FDA product code
- `clearance_type`: Type of 510(k) clearance
- `decision_date_from`/`decision_date_to`: Decision date range filters
- Plus standard pagination parameters

### Device Classifications
- `device_name`: Name of the medical device
- `device_class`: Device class (1, 2, 3)
- `medical_specialty`: Medical specialty
- `product_code`: FDA product code
- `regulation_number`: FDA regulation number
- Plus standard pagination parameters

### Device Adverse Events
- `device_name`: Name of the medical device
- `brand_name`: Brand name of the device
- `manufacturer`: Device manufacturer name
- `product_code`: FDA product code
- `event_type`: Type of adverse event
- `patient_sex`: Patient sex (F=Female, M=Male)
- `date_from`/`date_to`: Event date range filters
- Plus standard pagination parameters

### Device Recalls
- `product_description`: Product description or name
- `recalling_firm`: Name of the recalling firm
- `classification`: Recall classification (Class I, II, III)
- `status`: Recall status
- `product_code`: FDA product code
- `date_from`/`date_to`: Recall initiation date range filters
- Plus standard pagination parameters

## Future Enhancements

The server architecture supports easy extension with additional FDA endpoints:

- **Device Tools**: 510(k) clearances, classifications, adverse events, recalls
- **Food Tools**: Adverse events, recall enforcement reports
- **Other Tools**: Substance data, UNII, tobacco reports, historical documents

## Error Handling

The server provides comprehensive error handling for:
- Invalid search parameters
- API rate limiting
- Network connectivity issues
- FDA API service unavailability
- Malformed responses

## Development

Built with:
- **TypeScript**: Type-safe development
- **MCP SDK**: Model Context Protocol implementation
- **Axios**: HTTP client with interceptors
- **Node.js**: Runtime environment

## License

This project is open source and available under standard licensing terms.

## Support

For issues or questions about the FDA API MCP Server:
1. Check the FDA API documentation: [https://open.fda.gov/apis/](https://open.fda.gov/apis/)
2. Review rate limiting and authentication requirements
3. Ensure proper JSON formatting in search parameters

---

*This MCP server provides access to public FDA datasets. Always consult healthcare professionals for medical decisions and drug information.*
