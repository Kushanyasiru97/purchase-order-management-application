using Microsoft.AspNetCore.Mvc;
using PurchaseOrderManagement.Application.DTOs;
using PurchaseOrderManagement.Application.Interfaces.Services;

namespace PurchaseOrderManagement.Backend.PurchaseOrderManagement.API.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchaseOrderController : ControllerBase
    {
        private readonly IPurchaseOrderService _purchaseOrderService;

        public PurchaseOrderController(IPurchaseOrderService purchaseOrderService)
        {
            _purchaseOrderService = purchaseOrderService;
        }

        
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetPurchaseOrders()
        {
            var response = await _purchaseOrderService.GetAllPurchaseOrdersAsync();

            if (!response.Success)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Status = "Error",
                    Message = response.Message,
                    Errors = response.Errors
                });
            }

            return Ok(response.Data);
        }

        
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetPurchaseOrderById(int id)
        {
            var response = await _purchaseOrderService.GetPurchaseOrderByIdAsync(id);

            if (!response.Success)
            {
                return NotFound(new
                {
                    Status = "Error",
                    Message = response.Message,
                    Errors = response.Errors
                });
            }

            return Ok(response.Data);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreatePurchaseOrder([FromBody] CreatePurchaseOrderDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    Status = "Error",
                    Message = "Validation failed",
                    Errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList()
                });
            }

            var response = await _purchaseOrderService.CreatePurchaseOrderAsync(createDto);

            if (!response.Success)
            {
                return BadRequest(new
                {
                    Status = "Error",
                    Message = response.Message,
                    Errors = response.Errors
                });
            }

            return CreatedAtAction(
                nameof(GetPurchaseOrderById),
                new { id = response.Data!.PurchaseOrderId },
                response.Data
            );
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdatePurchaseOrder(int id, [FromBody] UpdatePurchaseOrderDto updateDto)
        {
            if (id != updateDto.PurchaseOrderId)
            {
                return BadRequest(new
                {
                    Status = "Error",
                    Message = "ID in URL does not match ID in body"
                });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    Status = "Error",
                    Message = "Validation failed",
                    Errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList()
                });
            }

            var response = await _purchaseOrderService.UpdatePurchaseOrderAsync(updateDto);

            if (!response.Success)
            {
                if (response.Message.Contains("not found"))
                {
                    return NotFound(new
                    {
                        Status = "Error",
                        Message = response.Message,
                        Errors = response.Errors
                    });
                }

                return BadRequest(new
                {
                    Status = "Error",
                    Message = response.Message,
                    Errors = response.Errors
                });
            }

            return Ok(response.Data);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeletePurchaseOrder(int id)
        {
            var response = await _purchaseOrderService.DeletePurchaseOrderAsync(id);

            if (!response.Success)
            {
                return NotFound(new
                {
                    Status = "Error",
                    Message = response.Message,
                    Errors = response.Errors
                });
            }

            return Ok(new
            {
                Status = "Success",
                Message = response.Message
            });
        }
    }
}